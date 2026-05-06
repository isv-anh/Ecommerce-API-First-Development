import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/order-vouchers")
namespace Voucher.OrderVouchers {
    @get
    @route("")
    @operationId("getOrderVouchers")
    @tag("order-vouchers")
    op getOrderVouchers(
        @query orderId?: UUID,
    ): GetOrderVouchersResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postOrderVoucher")
    @tag("order-vouchers")
    op postOrderVoucher(@body body: PostOrderVoucherRequestBody):
        | PostOrderVoucherResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{orderVoucherId}")
    @operationId("getOrderVoucherById")
    @tag("order-vouchers")
    op getOrderVoucherById(
        @path orderVoucherId: UUID,
    ): GetOrderVoucherByIdResponse200 | BadRequestError | InternalServerError;

    @delete
    @route("/{orderVoucherId}")
    @operationId("deleteOrderVoucher")
    @tag("order-vouchers")
    op deleteOrderVoucher(@path orderVoucherId: UUID):
        | DeleteOrderVoucherResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
