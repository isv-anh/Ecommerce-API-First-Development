import { PrismaService } from '@/common/services/prisma.service';
import { PostRegisterBody } from '@e-commerce/api-validation/types/auth';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: { OR: [{ email }, { username: email }] },
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

    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      password: user.password,
      roles: user.user_roles.map((r) => r.roles.role_id),
    };
  }

  async findById(uid: string) {
    const user = await this.prismaService.users.findUnique({
      where: { uid },
      select: {
        uid: true,
        email: true,
        full_name: true,
        username: true,
      },
    });

    return user;
  }

  async register(body: PostRegisterBody) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const uid = crypto.randomUUID();

    try {
      return await this.prismaService.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            uid,
            email: body.email,
            password: hashedPassword,
            username: body.username,
          },
          select: {
            uid: true,
            email: true,
          },
        });

        const defaultRole = await tx.roles.findUnique({
          where: {
            role_name: 'USER',
          },
          select: {
            role_id: true,
          },
        });

        if (!defaultRole) {
          throw new InternalServerErrorException('Default role not found');
        }

        await tx.user_roles.create({
          data: {
            uid: user.uid,
            role_id: defaultRole.role_id,
          },
        });

        return {
          uid: user.uid,
          email: user.email,
          roleId: defaultRole.role_id,
        };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or username already exists');
      }

      throw error;
    }
  }
}
