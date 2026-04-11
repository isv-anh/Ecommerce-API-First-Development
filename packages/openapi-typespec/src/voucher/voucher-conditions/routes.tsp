import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/vouchers")
namespace Voucher.VoucherConditions {
    @get
    @route("/{voucherId}/conditions")
    @operationId("getVoucherConditions")
    @tag("voucher-conditions")
    op getVoucherConditions(
        @path voucherId: UUID,
    ): GetVoucherConditionsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{voucherId}/conditions")
    @operationId("postVoucherCondition")
    @tag("voucher-conditions")
    op postVoucherCondition(
        @path voucherId: UUID,
        @body body: PostVoucherConditionRequestBody,
    ):
        | PostVoucherConditionResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{voucherId}/conditions/{conditionId}")
    @operationId("getVoucherConditionById")
    @tag("voucher-conditions")
    op getVoucherConditionById(
        @path voucherId: UUID,
        @path conditionId: UUID,
    ): GetVoucherConditionByIdResponse200 | BadRequestError | InternalServerError;

    @delete
    @route("/{voucherId}/conditions/{conditionId}")
    @operationId("deleteVoucherCondition")
    @tag("voucher-conditions")
    op deleteVoucherCondition(@path voucherId: UUID, @path conditionId: UUID):
        | DeleteVoucherConditionResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
