import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/orders")
namespace Order.Payments {
    @get
    @route("/{orderId}/payments")
    @operationId("getPayments")
    @tag("order-payments")
    op getPayments(
        @path orderId: UUID,
    ): GetPaymentsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{orderId}/payments")
    @operationId("postPayment")
    @tag("order-payments")
    op postPayment(@path orderId: UUID, @body body: PostPaymentRequestBody):
        | PostPaymentResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{orderId}/payments/{paymentId}")
    @operationId("getPaymentById")
    @tag("order-payments")
    op getPaymentById(
        @path orderId: UUID,
        @path paymentId: UUID,
    ): GetPaymentByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{orderId}/payments/{paymentId}")
    @operationId("patchPayment")
    @tag("order-payments")
    op patchPayment(
        @path orderId: UUID,
        @path paymentId: UUID,
        @body body: PatchPaymentRequestBody,
    ):
        | PatchPaymentResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{orderId}/payments/{paymentId}")
    @operationId("deletePayment")
    @tag("order-payments")
    op deletePayment(@path orderId: UUID, @path paymentId: UUID):
        | DeletePaymentResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
