import { UsersService } from '@/api/v1/auth/services/user-service/users.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
