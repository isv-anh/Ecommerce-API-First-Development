import { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtService as NestjsJwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestjsJwtService: NestjsJwtService,
    private readonly configService: ConfigService,
  ) {}

  async extractAccessTokenPayload(token: string): Promise<JwtPayload> {
    try {
      return await this.nestjsJwtService.verifyAsync(token, {
        algorithms: ['HS256'],
      });
    } catch (err) {
      this.handleJwtError(err, 'Access');
    }
  }

  async extractRefreshTokenPayload(token: string): Promise<JwtPayload> {
    try {
      return await this.nestjsJwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        algorithms: ['HS256'],
      });
    } catch (err) {
      this.handleJwtError(err, 'Refresh');
    }
  }

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return await this.nestjsJwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return await this.nestjsJwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  }

  private handleJwtError(err: unknown, tokenType: 'Access' | 'Refresh'): never {
    if (err instanceof TokenExpiredError) {
      throw new UnauthorizedException(`${tokenType} token expired`);
    }

    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedException(
        `Invalid ${tokenType.toLowerCase()} token`,
      );
    }

    if (err instanceof NotBeforeError) {
      throw new UnauthorizedException(`${tokenType} token not active`);
    }

    throw new UnauthorizedException(`${tokenType} token verification failed`);
  }
}
