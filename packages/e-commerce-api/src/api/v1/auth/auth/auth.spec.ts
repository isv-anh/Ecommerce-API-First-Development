// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '@/api/v1/auth/services/user-service/users.service';
import { JwtService } from '@/api/v1/auth/services/jwt-service/jwt.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  uid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'hashed-password',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
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

      jwtService.generateAccessToken.mockResolvedValue(accessToken);

      jwtService.generateRefreshToken.mockResolvedValue(refreshToken);

      const result = await service.postRegister(body);

      expect(usersService.register).toHaveBeenCalledTimes(1);

      expect(usersService.register).toHaveBeenCalledWith(body);

      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
        sub: mockUser.uid,
        email: mockUser.email,
        roles: ['USER'],
      });

      expect(jwtService.generateRefreshToken).toHaveBeenCalledTimes(1);

      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({
        sub: mockUser.uid,
        email: mockUser.email,
        roles: ['USER'],
      });

      expect(result).toEqual({
        accessToken,
        refreshToken,
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
    it('should throw not implemented error', async () => {
      await expect(service.getProfile()).rejects.toThrow('Not implemented');
    });
  });
});
