// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '@/api/v1/auth/services/user-service/users.service';
import { JwtService } from '@/api/v1/auth/services/jwt-service/jwt.service';
import { ClsService } from '@/common/services/cls/cls.service';
import { PrismaService } from '@/common/services/prisma.service';
import { MailService } from '@/common/services/mail/mail.service';
import { ConfigService } from '@nestjs/config';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  uid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'hashed-password',
  is_email_verified: true,
  roles: ['USER'],
};

const mockPayload = {
  sub: mockUser.uid,
  email: mockUser.email,
  roles: mockUser.roles,
};

const accessToken = 'mock-access-token';
const refreshToken = 'mock-refresh-token';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let mockUserId: string | undefined;
  let mockUserPayload: unknown;

  beforeEach(async () => {
    mockUserId = mockUser.uid;
    mockUserPayload = { ...mockPayload };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ClsService,
          useFactory: () => ({
            get userId(): string | undefined {
              return mockUserId;
            },
            get payload(): unknown {
              return mockUserPayload;
            },
          }),
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            extractRefreshTokenPayload: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            verification_tokens: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            users: {
              update: jest.fn(),
            },
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('5'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  // ─── postLogin ───────────────────────────────────────────────────────────

  describe('postLogin', () => {
    const body = {
      username: 'test@example.com',
      password: 'password123',
    };

    it('should return accessToken and refreshToken', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.generateAccessToken.mockResolvedValue(accessToken);

      jwtService.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await service.postLogin(body);

      expect(usersService.findByEmail).toHaveBeenCalledTimes(1);

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed-password',
      );

      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateAccessToken).toHaveBeenCalledWith(mockPayload);

      expect(jwtService.generateRefreshToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith(mockPayload);

      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.postLogin(body)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.findByEmail).toHaveBeenCalledTimes(1);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.postLogin(body)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);

      expect(jwtService.generateAccessToken).not.toHaveBeenCalled();

      expect(jwtService.generateRefreshToken).not.toHaveBeenCalled();
    });
  });

  // ─── postRegister ────────────────────────────────────────────────────────

  describe('postRegister', () => {
    const body = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register user and return tokens', async () => {
      usersService.register.mockResolvedValue({
        uid: mockUser.uid,
        email: mockUser.email,
        roleId: 'USER',
      });

      const result = await service.postRegister(body);

      expect(usersService.register).toHaveBeenCalledTimes(1);

      expect(usersService.register).toHaveBeenCalledWith(body);

      expect(result).toEqual({
        message: 'Vui lòng kiểm tra email để lấy mã xác thực.',
      });
    });
  });

  // ─── postRefreshToken ────────────────────────────────────────────────────

  describe('postRefreshToken', () => {
    const body = {
      refreshToken: 'test-refresh-token',
    };

    it('should generate new access token and refresh token', async () => {
      jwtService.extractRefreshTokenPayload.mockResolvedValue(mockPayload);

      jwtService.generateAccessToken.mockResolvedValue(accessToken);

      jwtService.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await service.postRefreshToken(body);

      expect(jwtService.extractRefreshTokenPayload).toHaveBeenCalledTimes(1);

      expect(jwtService.extractRefreshTokenPayload).toHaveBeenCalledWith(
        'test-refresh-token',
      );

      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
        sub: mockPayload.sub,
        email: mockPayload.email,
        roles: mockPayload.roles,
      });

      expect(jwtService.generateRefreshToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({
        sub: mockPayload.sub,
        email: mockPayload.email,
        roles: mockPayload.roles,
      });

      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
    });

    it('should throw when refresh token is invalid', async () => {
      jwtService.extractRefreshTokenPayload.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(service.postRefreshToken(body)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(jwtService.extractRefreshTokenPayload).toHaveBeenCalledTimes(1);

      expect(jwtService.generateAccessToken).not.toHaveBeenCalled();

      expect(jwtService.generateRefreshToken).not.toHaveBeenCalled();
    });
  });

  // ─── getProfile ──────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      usersService.findById.mockResolvedValue({
        uid: mockUser.uid,
        email: mockUser.email,
        full_name: 'Test User',
        username: 'testuser',
      });

      const result = await service.getProfile();

      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.uid);
      expect(result).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        name: 'Test User',
      });
    });

    it('should throw UnauthorizedException when payload is missing', async () => {
      mockUserId = undefined;

      await expect(service.getProfile()).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getProfile()).rejects.toThrow(NotFoundException);
    });
  });
});
