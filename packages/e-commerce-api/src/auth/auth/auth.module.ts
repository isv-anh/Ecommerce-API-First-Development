import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AUTH_CONTROLLER,
  BaseAuthController,
} from '@generated-controller/auth/auth/base-auth.controller';

@Module({
  controllers: [BaseAuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_CONTROLLER,
      useClass: AuthController,
    },
  ],
})
export class AuthModule {}
