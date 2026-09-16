import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductVariantsRepository } from './product-variants.repository';

@Controller()
export class InventoryGrpcController {
  constructor(
    private readonly productVariantsRepository: ProductVariantsRepository,
  ) {}

  @GrpcMethod('InventoryService', 'GetProductInventory')
  async getProductInventory(data: { productId: string }) {
    const variants =
      await this.productVariantsRepository.getInventoryByProductId(
        data.productId,
      );
    return { variants };
  }
}
