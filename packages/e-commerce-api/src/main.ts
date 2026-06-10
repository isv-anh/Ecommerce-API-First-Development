import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from '@/common/exceptions-filter/prisma-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableCors({
    origin: ['http://localhost:3000'],

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],

    exposedHeaders: ['set-cookie'],

    maxAge: 86400,
  });

  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
