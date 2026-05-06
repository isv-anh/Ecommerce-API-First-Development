import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/shops/commission-settings")
namespace Shop.CommissionSettings {
    @get
    @route("")
    @operationId("getCommissionSettings")
    @tag("commission-settings")
    op getCommissionSettings(
        @query scope?: string,
        @query isActive?: boolean,
    ): GetCommissionSettingsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postCommissionSetting")
    @tag("commission-settings")
    op postCommissionSetting(@body body: PostCommissionSettingRequestBody):
        | PostCommissionSettingResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{commissionId}")
    @operationId("getCommissionSettingById")
    @tag("commission-settings")
    op getCommissionSettingById(
        @path commissionId: UUID,
    ): GetCommissionSettingByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{commissionId}")
    @operationId("patchCommissionSetting")
    @tag("commission-settings")
    op patchCommissionSetting(
        @path commissionId: UUID,
        @body body: PatchCommissionSettingRequestBody,
    ):
        | PatchCommissionSettingResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{commissionId}")
    @operationId("deleteCommissionSetting")
    @tag("commission-settings")
    op deleteCommissionSetting(@path commissionId: UUID):
        | DeleteCommissionSettingResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
