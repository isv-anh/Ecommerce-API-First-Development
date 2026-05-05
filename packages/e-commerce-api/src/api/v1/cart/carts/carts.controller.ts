import { Injectable } from '@nestjs/common';
import { CartsService } from './carts.service';
import type {
  DeleteCartParams,
  GetCart200Response,
  PostCartBody,
  PostCart201Response,
  GetCartQueryParams,
} from '@e-commerce/api-validation/types/cart';
import { BaseCartsControllerInterface } from '@generated-controller/cart/carts/base-carts.controller.interface';

@Injectable()
export class CartsController implements BaseCartsControllerInterface {
  constructor(private readonly service: CartsService) {}
  async getCart(query: GetCartQueryParams): Promise<GetCart200Response> {
    return await this.service.getCart(query);
  }

  /**
   * DELETE /v1/carts/:cartId
   */
  async deleteCart(params: DeleteCartParams): Promise<void> {
    await this.service.deleteCart(params);
  }

  /**
   * GET /v1/carts/users/:userId
   */
  async getCartByUserId(userId: string): Promise<GetCart200Response> {
    return await this.service.getCartByUserId(userId);
  }

  /**
   * POST /v1/carts
   */
  async postCart(body: PostCartBody): Promise<PostCart201Response> {
    return await this.service.postCart(body);
  }
}
