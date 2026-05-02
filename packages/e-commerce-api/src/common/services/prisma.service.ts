import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

    if (!DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
      throw new Error('Missing required database environment variables');
    }

    const connectionString = `postgresql://${encodeURIComponent(DB_USERNAME)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const adapter = new PrismaPg({
      connectionString,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
