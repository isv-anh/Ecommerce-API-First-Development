import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: 'order.v1',
            protoPath: join(process.cwd(), '../proto/order/v1/order.proto'),
            url: '0.0.0.0:50052',
        },
    });
    await app.listen();
    console.log('e-commerce-order gRPC microservice is running on 0.0.0.0:50052');
}
await bootstrap();
//# sourceMappingURL=main.js.map