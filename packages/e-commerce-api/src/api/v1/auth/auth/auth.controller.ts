import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  GetProfile200Response,
  PostLoginBody,
  PostLogin200Response,
  PostRefreshTokenBody,
  PostRefreshToken200Response,
  PostRegisterBody,
  PostRegister200Response,
} from '@e-commerce/api-validation/types/auth';
import { BaseAuthControllerInterface } from '@generated-controller/auth/auth/base-auth.controller.interface';

@Injectable()
export class AuthController implements BaseAuthControllerInterface {
  constructor(private readonly service: AuthService) {}

  /**
   * GET /auth/profile
   */
  async getProfile(): Promise<GetProfile200Response> {
    return await this.service.getProfile();
  }

  /**
   * POST /auth/login
   */
  async postLogin(body: PostLoginBody): Promise<PostLogin200Response> {
    return await this.service.postLogin(body);
  }

  /**
   * POST /auth/refresh
   */
  async postRefreshToken(
    body: PostRefreshTokenBody,
  ): Promise<PostRefreshToken200Response> {
    return await this.service.postRefreshToken(body);
  }

  /**
   * POST /auth/register
   */
  async postRegister(body: PostRegisterBody): Promise<PostRegister200Response> {
    console.log('AuthController called');
    return await this.service.postRegister(body);
  }
}
