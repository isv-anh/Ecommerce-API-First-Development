// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { PrismaService } from '@/common/services/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  uid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'hashed-password',
  user_roles: [
    {
      roles: {
        role_id: 'USER',
      },
    },
  ],
};

const mockRegisterBody = {
  username: 'test',
  email: 'test@example.com',
  name: 'testuser',
  password: 'password123',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: {
    users: {
      findFirst: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      users: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  // ─── findByEmail ──────────────────────────────────────────────────────────

  describe('findByEmail', () => {
    it('should return mapped user data', async () => {
      prismaService.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prismaService.users.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.users.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'test@example.com' }, { username: 'test@example.com' }],
        },
        select: {
          uid: true,
          email: true,
          password: true,
          user_roles: {
            select: {
              roles: {
                select: {
                  role_id: true,
                },
              },
            },
          },
        },
      });

      expect(result).toEqual({
        uid: mockUser.uid,
        email: mockUser.email,
        password: mockUser.password,
        roles: ['USER'],
      });
    });

    it('should return null if user does not exist', async () => {
      prismaService.users.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register', () => {
    beforeEach(() => {
      jest
        .spyOn(global.crypto, 'randomUUID')
        .mockReturnValue(
          mockUser.uid as `${string}-${string}-${string}-${string}-${string}`,
        );

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should register user successfully', async () => {
      prismaService.$transaction.mockImplementation(
        <T>(callback: (tx: any) => T): T => {
          const tx = {
            users: {
              create: jest.fn().mockResolvedValue({
                uid: mockUser.uid,
                email: mockUser.email,
              }),
            },
            roles: {
              findUnique: jest.fn().mockResolvedValue({
                role_id: 'USER',
              }),
            },
            user_roles: {
              create: jest.fn().mockResolvedValue(undefined),
            },
          };

          return callback(tx);
        },
      );

      const result = await service.register(mockRegisterBody);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        uid: mockUser.uid,
        email: mockUser.email,
        roleId: 'USER',
      });
    });

    it('should throw InternalServerErrorException when default role does not exist', async () => {
      prismaService.$transaction.mockImplementation(
        <T>(callback: (tx: any) => T): T => {
          const tx = {
            users: {
              create: jest.fn().mockResolvedValue({
                uid: mockUser.uid,
                email: mockUser.email,
              }),
            },
            roles: {
              findUnique: jest.fn().mockResolvedValue(null),
            },
            user_roles: {
              create: jest.fn(),
            },
          };

          return callback(tx);
        },
      );

      await expect(service.register(mockRegisterBody)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      prismaService.$transaction.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '6.0.0',
        }),
      );

      await expect(service.register(mockRegisterBody)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow unknown errors', async () => {
      const error = new Error('Unknown error');

      prismaService.$transaction.mockRejectedValue(error);

      await expect(service.register(mockRegisterBody)).rejects.toThrow(error);
    });
  });
});
