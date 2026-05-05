import { Injectable } from '@nestjs/common';
import type {
  DeleteCartParams,
  PostCartBody,
  PostCart201Response,
  GetCart200Response,
  GetCartQueryParams,
} from '@e-commerce/api-validation/types/cart';
import type { BaseCartsControllerInterface } from '@generated-controller/cart/carts/base-carts.controller.interface';
import { CartsRepository } from '@/api/v1/cart/carts/carts.repository';

@Injectable()
export class CartsService implements BaseCartsControllerInterface {
  constructor(private readonly cartsRepository: CartsRepository) {}
  getCart(query: GetCartQueryParams): Promise<GetCart200Response> {
    console.log('getCart called with query:', query);
    throw new Error('Method not implemented.');
  }

  /**
   * DELETE /v1/carts/:cartId
   */
  async deleteCart(params: DeleteCartParams): Promise<void> {
    await this.cartsRepository.deleteCart(params.cartId);
  }

  /**
   * GET /v1/carts/users/:userId
   * Note: The route in OpenAPI might be slightly different, let's assume it maps to this logic
   */
  async getCartByUserId(userId: string): Promise<GetCart200Response> {
    return await this.cartsRepository.getCartByUserId(userId);
  }

  /**
   * POST /v1/carts
   */
  async postCart(body: PostCartBody): Promise<PostCart201Response> {
    const cartId = await this.cartsRepository.createCart(body);
    return { cartId };
  }
}
