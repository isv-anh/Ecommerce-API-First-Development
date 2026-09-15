import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'order.v1',
      protoPath: join(process.cwd(), '../proto/order/v1/order.proto'),
      url: '0.0.0.0:50052', // Using port 50052 as 50051 is used by ai_assistant
    },
  });
  await app.listen();
  console.log('e-commerce-order gRPC microservice is running on 0.0.0.0:50052');
}
await bootstrap();
