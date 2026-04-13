import { Injectable } from '@nestjs/common';
import type {
  GetProfile200Response,
  PostLoginBody,
  PostLogin200Response,
  PostRefreshTokenBody,
  PostRefreshToken200Response,
  PostRegisterBody,
  PostRegister200Response,
} from '@e-commerce/api-validation/types/auth';

@Injectable()
export class AuthService {
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
    throw new Error('Not implemented');
  }

  /**
   * POST /auth/refresh
   */
  async postRefreshToken(
    body: PostRefreshTokenBody,
  ): Promise<PostRefreshToken200Response> {
    return {
      accessToken: 'testToken',
      refreshToken: 'testRefreshToken',
    };
  }

  /**
   * POST /auth/register
   */
  async postRegister(body: PostRegisterBody): Promise<PostRegister200Response> {
    throw new Error('Not implemented');
  }
}
