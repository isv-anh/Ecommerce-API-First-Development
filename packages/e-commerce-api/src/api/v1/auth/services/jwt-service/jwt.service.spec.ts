// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtService as NestjsJwtService } from '@nestjs/jwt';
import type { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
  })),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockPayload: JwtPayload = {
  sub: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  roles: ['admin'],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('JwtService', () => {
  let service: JwtService;
  let nestjsJwtService: jest.Mocked<NestjsJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestjsJwtService,
          useValue: {
            verifyAsync: jest.fn(),
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    nestjsJwtService = module.get(NestjsJwtService);

    jest.clearAllMocks();
  });

  // ─── extractAccessTokenPayload ───────────────────────────────────────────

  describe('extractAccessTokenPayload', () => {
    const token = 'mock-access-token';

    it('should return decoded payload', async () => {
      nestjsJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.extractAccessTokenPayload(token);

      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        algorithms: ['HS256'],
      });

      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      nestjsJwtService.verifyAsync.mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(service.extractAccessTokenPayload(token)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledTimes(1);
    });
  });

  // ─── extractRefreshTokenPayload ──────────────────────────────────────────

  describe('extractRefreshTokenPayload', () => {
    const token = 'mock-refresh-token';

    it('should return decoded payload', async () => {
      nestjsJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.extractRefreshTokenPayload(token);

      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        algorithms: ['HS256'],
      });

      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      nestjsJwtService.verifyAsync.mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(service.extractRefreshTokenPayload(token)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(nestjsJwtService.verifyAsync).toHaveBeenCalledTimes(1);
    });
  });

  // ─── generateAccessToken ─────────────────────────────────────────────────

  describe('generateAccessToken', () => {
    it('should generate access token', async () => {
      const token = 'generated-access-token';

      nestjsJwtService.signAsync.mockResolvedValue(token);

      const result = await service.generateAccessToken(mockPayload);

      expect(nestjsJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(nestjsJwtService.signAsync).toHaveBeenCalledWith(mockPayload, {
        algorithm: 'HS256',
        expiresIn: '15m',
      });

      expect(result).toBe(token);
    });
  });

  // ─── generateRefreshToken ────────────────────────────────────────────────

  describe('generateRefreshToken', () => {
    it('should generate refresh token', async () => {
      const token = 'generated-refresh-token';

      nestjsJwtService.signAsync.mockResolvedValue(token);

      const result = await service.generateRefreshToken(mockPayload);

      expect(nestjsJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(nestjsJwtService.signAsync).toHaveBeenCalledWith(mockPayload, {
        algorithm: 'HS256',
        expiresIn: '7d',
      });

      expect(result).toBe(token);
    });
  });
});
