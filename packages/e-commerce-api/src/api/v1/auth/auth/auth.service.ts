import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import type {
  GetProfile200Response,
  PostLoginBody,
  PostLogin200Response,
  PostRefreshTokenBody,
  PostRefreshToken200Response,
  PostRegisterBody,
  PostRegister200Response,
  PostVerifyEmailBody,
  PostVerifyEmail200Response,
  PostResendVerificationBody,
} from '@e-commerce/api-validation/types/auth';
import { UsersService } from '@/api/v1/auth/services/user-service/users.service';
import { JwtService } from '@/api/v1/auth/services/jwt-service/jwt.service';
import { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';
import { ClsService } from '@/common/services/cls/cls.service';
import { PrismaService } from '@/common/services/prisma.service';
import { MailService } from '@/common/services/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private async generateAndSaveOtp(userId: string): Promise<string> {
    const maxRetries = 3;
    const expirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES') || '5',
      10,
    );
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    for (let i = 0; i < maxRetries; i++) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
      try {
        await this.prisma.verification_tokens.create({
          data: {
            id: crypto.randomUUID(),
            user_id: userId,
            token: otp,
            expires_at: expiresAt,
          },
        });
        return otp;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue; // Retry on collision
        }
        throw error;
      }
    }
    throw new InternalServerErrorException('Could not generate a unique OTP');
  }

  /**
   * GET /auth/profile
   */
  async getProfile(): Promise<GetProfile200Response> {
    const userId = this.clsService.userId;
    if (!userId) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.uid,
      email: user.email,
      name: user.full_name || user.username,
    };
  }

  /**
   * POST /auth/login
   */
  async postLogin(body: PostLoginBody): Promise<PostLogin200Response> {
    const user = await this.usersService.findByEmail(body.username);

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_email_verified) {
      // Xoá token cũ nếu có
      await this.prisma.verification_tokens.deleteMany({
        where: { user_id: user.uid },
      });

      const otp = await this.generateAndSaveOtp(user.uid);
      const expirationMinutes = parseInt(
        this.configService.get<string>('OTP_EXPIRATION_MINUTES') || '5',
        10,
      );

      await this.mailService.sendVerificationEmail(
        user.email,
        otp,
        expirationMinutes,
      );

      throw new UnauthorizedException({
        message:
          'Tài khoản chưa được xác thực email. Mã xác nhận mới đã được gửi.',
        code: 'USER_UNVERIFIED',
      });
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

    // Generate and save OTP
    const otp = await this.generateAndSaveOtp(user.uid);
    const expirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES') || '5',
      10,
    );

    // Send verification email
    await this.mailService.sendVerificationEmail(
      user.email,
      otp,
      expirationMinutes,
    );

    return {
      message: 'Vui lòng kiểm tra email để lấy mã xác thực.',
    };
  }

  /**
   * POST /auth/verify-email
   */
  async postVerifyEmail(
    body: PostVerifyEmailBody,
  ): Promise<PostVerifyEmail200Response> {
    const userToVerify = await this.usersService.findByEmail(body.email);
    if (!userToVerify) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const verification = await this.prisma.verification_tokens.findUnique({
      where: { token: body.otp },
      include: { users: true },
    });

    if (!verification || verification.user_id !== userToVerify.uid) {
      throw new UnauthorizedException('Mã xác thực không hợp lệ');
    }

    if (verification.expires_at < new Date()) {
      throw new UnauthorizedException('Mã xác thực đã hết hạn');
    }

    await this.prisma.users.update({
      where: { uid: verification.user_id },
      data: { is_email_verified: true },
    });

    await this.prisma.verification_tokens.delete({
      where: { id: verification.id },
    });

    const user = await this.usersService.findByEmail(verification.users.email);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
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
   * POST /auth/resend-verification
   */
  async postResendVerification(body: PostResendVerificationBody) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    if (user.is_email_verified) {
      throw new ConflictException('Tài khoản đã được xác thực');
    }

    // Delete old tokens
    await this.prisma.verification_tokens.deleteMany({
      where: { user_id: user.uid },
    });

    const otp = await this.generateAndSaveOtp(user.uid);
    const expirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES') || '5',
      10,
    );

    await this.mailService.sendVerificationEmail(
      user.email,
      otp,
      expirationMinutes,
    );

    return {
      message: 'Vui lòng kiểm tra email để lấy mã xác thực mới.',
    };
  }
}
