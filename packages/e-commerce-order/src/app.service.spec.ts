import { describe, expect, it, vi } from 'vitest';
import { AppService } from './app.service.js';
import type { PrismaService } from './prisma.service.js';

describe('cancelOrder', () => {
  it('updates only eligible orders in one atomic operation', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const service = new AppService({ orders: { updateMany } } as unknown as PrismaService);
    const result = await service.cancelOrder({ orderId: 'order-id', reason: 'Customer requested' });
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: 'order-id',
        OR: [
          { status: { equals: 'PENDING', mode: 'insensitive' } },
          { status: { equals: 'CONFIRMED', mode: 'insensitive' } },
        ],
      },
      data: { status: 'CANCELLED' },
    });
    expect(result.success).toBe(true);
  });

  it('does not report success when the order is missing or no longer eligible', async () => {
    const service = new AppService({ orders: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) } } as unknown as PrismaService);
    expect(await service.cancelOrder({ orderId: 'order-id' })).toMatchObject({ success: false });
  });

  it('propagates database failures', async () => {
    const service = new AppService({ orders: { updateMany: vi.fn().mockRejectedValue(new Error('database unavailable')) } } as unknown as PrismaService);
    await expect(service.cancelOrder({ orderId: 'order-id' })).rejects.toThrow('database unavailable');
  });
});
