import { Injectable } from '@nestjs/common';
import { OrderPaymentsService } from './order-payments.service';
import type {
  DeletePaymentParams,
  GetPaymentByIdParams,
  GetPaymentById200Response,
  GetPaymentsParams,
  GetPayments200Response,
  PatchPaymentParams,
  PatchPaymentBody,
  PostPaymentParams,
  PostPaymentBody,
  PostPayment201Response,
} from '@e-commerce/api-validation/types/order';
import { BaseOrderPaymentsControllerInterface } from '@generated-controller/order/order-payments/base-order-payments.controller.interface';

@Injectable()
export class OrderPaymentsController implements BaseOrderPaymentsControllerInterface {
  constructor(private readonly service: OrderPaymentsService) {}

  /**
   * DELETE /api/v1/orders/:orderId/payments/:paymentId
   * @param params - path parameters
   */
  async deletePayment(params: DeletePaymentParams): Promise<void> {
    await this.service.deletePayment(params);
  }

  /**
   * GET /api/v1/orders/:orderId/payments/:paymentId
   * @param params - path parameters
   * @returns payment details
   */
  async getPaymentById(
    params: GetPaymentByIdParams,
  ): Promise<GetPaymentById200Response> {
    return await this.service.getPaymentById(params);
  }

  /**
   * GET /api/v1/orders/:orderId/payments
   * @param params - path parameters
   * @returns list of payments
   */
  async getPayments(
    params: GetPaymentsParams,
  ): Promise<GetPayments200Response> {
    return await this.service.getPayments(params);
  }

  /**
   * PATCH /api/v1/orders/:orderId/payments/:paymentId
   * @param params - path parameters
   * @param body - partial update data
   */
  async patchPayment(
    params: PatchPaymentParams,
    body: PatchPaymentBody,
  ): Promise<void> {
    await this.service.patchPayment(params, body);
  }

  /**
   * POST /api/v1/orders/:orderId/payments
   * @param params - path parameters
   * @param body - creation data
   * @returns created payment id
   */
  async postPayment(
    params: PostPaymentParams,
    body: PostPaymentBody,
  ): Promise<PostPayment201Response> {
    return await this.service.postPayment(params, body);
  }
}
