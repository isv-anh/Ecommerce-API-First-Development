import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private readonly exchangeName = 'product_events';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const rabbitMqUrl =
      process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    try {
      this.logger.log(`Connecting to RabbitMQ at ${rabbitMqUrl}`);
      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();

      // Setup exchange (topic or fanout, let's use fanout for simplicity if there's only one subscriber, or topic for future routing)
      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      this.logger.log(
        'Connected to RabbitMQ and asserted exchange successfully',
      );

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error', err);
        this.reconnect().catch((e) =>
          this.logger.error('Error in reconnect', e),
        );
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
        this.reconnect().catch((e) =>
          this.logger.error('Error in reconnect', e),
        );
      });
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      // Implement retry mechanism in production
      setTimeout(() => {
        this.reconnect().catch((e) =>
          this.logger.error('Error in reconnect', e),
        );
      }, 5000);
    }
  }

  private async reconnect() {
    this.logger.log('Reconnecting to RabbitMQ...');
    this.connection = null;
    this.channel = null;
    await this.connect();
  }

  private async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  publish(routingKey: string, message: any): Promise<boolean> {
    if (!this.channel) {
      this.logger.error('Cannot publish message, channel is not initialized');
      return Promise.resolve(false);
    }
    try {
      const payload = Buffer.from(JSON.stringify(message));
      const success = this.channel.publish(
        this.exchangeName,
        routingKey,
        payload,
        {
          persistent: true,
        },
      );
      return Promise.resolve(success);
    } catch (error) {
      this.logger.error(
        `Error publishing message with routing key ${routingKey}`,
        error,
      );
      return Promise.resolve(false);
    }
  }
}
