import { Injectable } from '@nestjs/common';
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
import type { BaseOrderPaymentsControllerInterface } from '@generated-controller/order/order-payments/base-order-payments.controller.interface';
import { OrderPaymentsRepository } from '@/api/v1/order/order-payments/order-payments.repository';

@Injectable()
export class OrderPaymentsService
  implements BaseOrderPaymentsControllerInterface
{
  constructor(
    private readonly orderPaymentsRepository: OrderPaymentsRepository,
  ) {}

  /**
   * DELETE /api/v1/orders/:orderId/payments/:paymentId
   * @param params - path parameters
   */
  async deletePayment(params: DeletePaymentParams): Promise<void> {
    await this.orderPaymentsRepository.deletePayment(params.paymentId);
  }

  /**
   * GET /api/v1/orders/:orderId/payments/:paymentId
   * @param params - path parameters
   * @returns payment details
   */
  async getPaymentById(
    params: GetPaymentByIdParams,
  ): Promise<GetPaymentById200Response> {
    return await this.orderPaymentsRepository.getPaymentById(params.paymentId);
  }

  /**
   * GET /api/v1/orders/:orderId/payments
   * @param params - path parameters
   * @returns list of payments
   */
  async getPayments(
    params: GetPaymentsParams,
  ): Promise<GetPayments200Response> {
    return await this.orderPaymentsRepository.getPayments(params.orderId);
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
    await this.orderPaymentsRepository.updatePayment(params.paymentId, body);
  }

  /**
   * POST /api/v1/orders/:orderId/payments
   * @param params - path parameters
   * @param body - payment creation data
   * @returns created payment id
   */
  async postPayment(
    params: PostPaymentParams,
    body: PostPaymentBody,
  ): Promise<PostPayment201Response> {
    const paymentId = await this.orderPaymentsRepository.createPayment(
      params.orderId,
      body,
    );
    return { paymentId };
  }
}
