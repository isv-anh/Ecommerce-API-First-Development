import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/vouchers")
namespace Voucher.Vouchers {
    @get
    @route("")
    @operationId("getVouchers")
    @tag("vouchers")
    op getVouchers(
        @query isActive?: boolean,
    ): GetVouchersResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postVoucher")
    @tag("vouchers")
    op postVoucher(@body body: PostVoucherRequestBody):
        | PostVoucherResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{voucherId}")
    @operationId("getVoucherById")
    @tag("vouchers")
    op getVoucherById(
        @path voucherId: UUID,
    ): GetVoucherByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{voucherId}")
    @operationId("patchVoucher")
    @tag("vouchers")
    op patchVoucher(
        @path voucherId: UUID,
        @body body: PatchVoucherRequestBody,
    ):
        | PatchVoucherResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{voucherId}")
    @operationId("deleteVoucher")
    @tag("vouchers")
    op deleteVoucher(@path voucherId: UUID):
        | DeleteVoucherResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
