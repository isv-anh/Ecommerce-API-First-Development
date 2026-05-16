import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AUTH_CONTROLLER,
  BaseAuthController,
} from '@generated-controller/auth/auth/base-auth.controller';
import { UsersModule } from '@/api/v1/auth/services/user-service/users.module';

@Module({
  imports: [UsersModule],
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
