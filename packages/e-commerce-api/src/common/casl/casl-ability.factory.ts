import { PrismaService } from '@/common/services/prisma.service';
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

export type Subjects =
  | 'Product'
  | 'Brand'
  | 'Cart'
  | 'Order'
  | 'Shop'
  | 'Voucher'
  | 'Address'
  | 'Review'
  | 'Wishlist'
  | 'all';

export const Action = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
  Approve: 'approve',
  Reject: 'reject',
  Checkout: 'checkout',
  Cancel: 'cancel',
} as const;

export type Action = (typeof Action)[keyof typeof Action];

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly prisma: PrismaService) {}

  async createAppAbility(roleIds: string[]): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const permissions = await this.prisma.$queryRaw<
      {
        action: string;
        subject: string;
      }[]
    >`
      SELECT
        p.action,
        p.subject
      FROM role_permissions rp
      INNER JOIN permissions p
        ON p.pid = rp.permission_id
      WHERE rp.role_id IN (${Prisma.join(roleIds)})
    `;

    for (const permission of permissions) {
      can(permission.action as Action, permission.subject as Subjects);
    }

    return build();
  }
}
