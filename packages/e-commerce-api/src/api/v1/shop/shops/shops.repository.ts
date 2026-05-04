import { PrismaService } from '@/common/services/prisma.service';
import { parseSort } from '@/utils/parse-sort';
import {
  GetShops200Response,
  GetShopsQueryParams,
  GetShopById200Response,
  PatchShopBody,
  PostShopBody,
} from '@e-commerce/api-validation/types/shop';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ShopsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteShop(shopId: string): Promise<void> {
    await this.prisma.shops.delete({
      where: { id: shopId },
    });
  }

  async getShops(query: GetShopsQueryParams): Promise<GetShops200Response> {
    const whereClause: Prisma.shopsWhereInput = {
      ...(query.ownerIds &&
        query.ownerIds.length > 0 && { owner_id: { in: query.ownerIds } }),
      ...(query.shop && {
        OR: [
          { name: { contains: query.shop, mode: 'insensitive' } },
          { slug: { contains: query.shop, mode: 'insensitive' } },
        ],
      }),
    };

    const shops = (
      await this.prisma.shops.findMany({
        where: whereClause,
        take: query.pageSize,
        skip: query.pageSize * (query.page - 1),
        orderBy: parseSort(query.orderBy) || [{ id: 'asc' }],
      })
    ).map((shop) => ({
      shopId: shop.id,
      ownerId: shop.owner_id,
      name: shop.name,
      slug: shop.slug,
      description: shop.description ?? undefined,
      logoUrl: shop.logo_url ?? undefined,
      status: shop.status ?? 'inactive',
      rating: shop.rating ? Number(shop.rating) : 0,
      totalProducts: shop.total_products ?? 0,
      totalOrders: shop.total_orders ?? 0,
      createdAt: shop.created_at?.toISOString() ?? '',
      updatedAt: shop.updated_at?.toISOString() ?? '',
    }));

    const totalCount = await this.prisma.shops.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / query.pageSize);

    return {
      totalCount,
      totalPages,
      shops,
    };
  }

  async getShopById(shopId: string): Promise<GetShopById200Response> {
    const shop = await this.prisma.shops.findUnique({
      where: { id: shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return {
      shopId: shop.id,
      ownerId: shop.owner_id,
      name: shop.name,
      slug: shop.slug,
      description: shop.description ?? undefined,
      logoUrl: shop.logo_url ?? undefined,
      status: shop.status ?? undefined,
      rating: shop.rating ? Number(shop.rating) : 0,
      totalProducts: shop.total_products || 0,
      totalOrders: shop.total_orders || 0,
      createdAt: shop.created_at?.toISOString() ?? '',
    };
  }

  async updateShop(shopId: string, data: PatchShopBody): Promise<void> {
    await this.prisma.shops.update({
      where: { id: shopId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo_url: data.logoUrl,
        status: data.status,
      },
    });
  }

  async createShop(data: PostShopBody): Promise<string> {
    const shopId = crypto.randomUUID();

    await this.prisma.shops.create({
      data: {
        id: shopId,
        owner_id: data.ownerId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo_url: data.logoUrl,
        status: data.status || 'active',
      },
    });
    return shopId;
  }
}
