import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/services/prisma.service';
import { RabbitMQService } from '@/common/services/rabbitmq.service';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Find pending events
      const events = await this.prisma.outbox_events.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { created_at: 'asc' },
      });

      if (events.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.debug(`Found ${events.length} pending outbox events.`);

      for (const event of events) {
        // Publish to RabbitMQ
        const routingKey = `product.${event.event_type.toLowerCase()}`; // e.g. product.created

        const success = await this.rabbitMQService.publish(routingKey, {
          eventId: event.id,
          aggregateType: event.aggregate_type,
          aggregateId: event.aggregate_id,
          eventType: event.event_type,
          payload: event.payload,
          timestamp: event.created_at,
        });

        if (success) {
          // Mark as processed
          await this.prisma.outbox_events.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          this.logger.debug(`Successfully processed event ${event.id}`);
        } else {
          this.logger.error(`Failed to publish event ${event.id} to RabbitMQ.`);
          // Don't update status, it will retry next time
        }
      }
    } catch (error) {
      this.logger.error('Error processing outbox events', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
