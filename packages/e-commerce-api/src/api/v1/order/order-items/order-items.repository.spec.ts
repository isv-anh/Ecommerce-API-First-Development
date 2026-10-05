import { OrderItemsRepository } from './order-items.repository';
import { PrismaService } from '@/common/services/prisma.service';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const item = {
  id: 'item',
  order_id: 'order',
  product_id: 'product',
  product_variant_id: 'variant',
  product_name: 'Tên lúc mua',
  variant_name: 'Size L',
  price: 100,
  quantity: 2,
  total_price: 200,
};

describe('OrderItemsRepository images', () => {
  const prisma = {
    order_items: { findMany: jest.fn(), findUnique: jest.fn() },
    products: { findMany: jest.fn() },
    product_variants: { findMany: jest.fn() },
  };
  const repository = new OrderItemsRepository(
    prisma as unknown as PrismaService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.order_items.findMany.mockResolvedValue([item]);
    prisma.order_items.findUnique.mockResolvedValue(item);
    prisma.products.findMany.mockResolvedValue([
      { id: 'product', thumbnail_url: 'product.jpg' },
    ]);
    prisma.product_variants.findMany.mockResolvedValue([
      { id: 'variant', thumbnail_url: 'variant.jpg' },
    ]);
  });

  it('prefers variant images without replacing historical name or price', async () => {
    const result = await repository.getOrderItems('order');
    expect(result.orderItems[0]).toMatchObject({
      thumbnailUrl: 'variant.jpg',
      productName: 'Tên lúc mua',
      price: 100,
      quantity: 2,
      totalPrice: 200,
    });
  });

  it('uses the product image when the variant image is unavailable', async () => {
    prisma.product_variants.findMany.mockResolvedValue([
      { id: 'variant', thumbnail_url: '' },
    ]);
    expect((await repository.getOrderItemById('item')).thumbnailUrl).toBe(
      'product.jpg',
    );
  });

  it('keeps purchased items when their catalog records have been deleted', async () => {
    prisma.products.findMany.mockResolvedValue([]);
    prisma.product_variants.findMany.mockResolvedValue([]);
    expect(
      (await repository.getOrderItems('order')).orderItems[0],
    ).toMatchObject({
      thumbnailUrl: null,
      productName: 'Tên lúc mua',
      totalPrice: 200,
    });
  });

  it('batches repeated product and variant ids into one query each', async () => {
    prisma.order_items.findMany.mockResolvedValue([
      item,
      { ...item, id: 'item-2' },
    ]);
    await repository.getOrderItems('order');
    expect(prisma.products.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.product_variants.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.product_variants.findMany).toHaveBeenCalledWith({
      where: { id: { in: ['variant'] } },
      select: { id: true, thumbnail_url: true },
    });
  });

  it('does not query the catalog for an empty order', async () => {
    prisma.order_items.findMany.mockResolvedValue([]);
    expect(await repository.getOrderItems('order')).toEqual({ orderItems: [] });
    expect(prisma.products.findMany).not.toHaveBeenCalled();
    expect(prisma.product_variants.findMany).not.toHaveBeenCalled();
  });
});
