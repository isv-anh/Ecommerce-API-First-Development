import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<PrismaClientKnownRequestError> {
  catch(error: PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundException('Resource not found');

      case 'P2002':
        throw new ConflictException('Duplicate field');

      case 'P2003':
        throw new BadRequestException('Invalid foreign key');

      default:
        throw error;
    }
  }
}
