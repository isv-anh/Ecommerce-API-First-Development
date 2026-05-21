/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
// TODO: Implement AuthService methods and remove eslint-disable comments
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  GetProfile200Response,
  PostLoginBody,
  PostLogin200Response,
  PostRefreshTokenBody,
  PostRefreshToken200Response,
  PostRegisterBody,
  PostRegister200Response,
} from '@e-commerce/api-validation/types/auth';
import { UsersService } from '@/api/v1/auth/services/user-service/users.service';
import { JwtService } from '@/api/v1/auth/services/jwt-service/jwt.service';
import { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * GET /auth/profile
   */
  async getProfile(): Promise<GetProfile200Response> {
    throw new Error('Not implemented');
  }

  /**
   * POST /auth/login
   */
  async postLogin(body: PostLoginBody): Promise<PostLogin200Response> {
    const user = await this.usersService.findByEmail(body.username);

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.generateAccessToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * POST /auth/refresh
   */
  // TODO: revoke refresh token
  async postRefreshToken(
    body: PostRefreshTokenBody,
  ): Promise<PostRefreshToken200Response> {
    const payload = await this.jwtService.extractRefreshTokenPayload(
      body.refreshToken,
    );

    const accessToken = await this.jwtService.generateAccessToken({
      email: payload.email,
      roles: payload.roles,
      sub: payload.sub,
    });
    const refreshToken = await this.jwtService.generateRefreshToken({
      email: payload.email,
      roles: payload.roles,
      sub: payload.sub,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * POST /auth/register
   */
  async postRegister(body: PostRegisterBody): Promise<PostRegister200Response> {
    const user = await this.usersService.register(body);

    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      roles: [user.roleId],
    };

    const accessToken = await this.jwtService.generateAccessToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
