import { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestjsJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestjsJwtService: NestjsJwtService) {}

  async extractAccessTokenPayload(token: string): Promise<JwtPayload> {
    try {
      return await this.nestjsJwtService.verifyAsync(token, {
        algorithms: ['HS256'],
      });
    } catch (err) {
      console.error('JWT ERROR:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async extractRefreshTokenPayload(token: string): Promise<JwtPayload> {
    try {
      return await this.nestjsJwtService.verifyAsync(token, {
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
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
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  }
}
