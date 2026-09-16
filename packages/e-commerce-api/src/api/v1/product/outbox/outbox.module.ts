import { Module } from '@nestjs/common';
import { RabbitMQService } from '@/common/services/rabbitmq.service';
import { PrismaModule } from '@/common/services/prisma.module';
import { OutboxProcessorService } from './outbox-processor.service';

@Module({
  imports: [PrismaModule],
  providers: [RabbitMQService, OutboxProcessorService],
  exports: [RabbitMQService],
})
export class OutboxModule {}
