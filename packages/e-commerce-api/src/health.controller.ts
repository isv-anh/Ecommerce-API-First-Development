import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  async readiness() {
    const result = {
      db: 'up',
      redis: 'up',
    };

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
    } catch {
      result.db = 'down';
      throw new ServiceUnavailableException({
        status: 'error',
        dependencies: { db: 'down' },
      });
    }

    return {
      status: result.db === 'up' ? 'ok' : 'error',
      dependencies: result,
    };
  }
}
