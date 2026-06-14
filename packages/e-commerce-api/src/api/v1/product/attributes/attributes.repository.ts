// attributes.repository.ts
import { PrismaService } from '@/common/services/prisma.service';
import { GetAttributesQueryParams } from '@e-commerce/api-validation/types/product';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetAttributesQueryParams) {
    const where = {
      name: query.attributeName
        ? { contains: query.attributeName, mode: 'insensitive' as const }
        : undefined,
    };

    const [attributes, totalCount] = await this.prisma.$transaction([
      this.prisma.attributes.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.attributes.count({ where }),
    ]);

    return { attributes, totalCount };
  }

  async findById(id: string) {
    return this.prisma.attributes.findUnique({
      where: { id },
    });
  }

  async create(data: { id: string; name: string }) {
    return this.prisma.attributes.create({
      data,
    });
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.attributes.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.attributes.delete({
      where: { id },
    });
  }
}
