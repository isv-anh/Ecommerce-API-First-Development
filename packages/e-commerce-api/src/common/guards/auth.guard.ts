import { JwtService } from '@/api/v1/auth/services/jwt-service/jwt.service';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ClsService } from '@/common/services/cls/cls.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Missing token');

    const jwtPayload = await this.jwtService.extractAccessTokenPayload(token);
    request['payload'] = jwtPayload;

    const store = this.clsService.getStore();
    if (store) {
      store.userId = jwtPayload.sub;
      store.payload = jwtPayload;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
