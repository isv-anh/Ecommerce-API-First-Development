import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/flash-sales")
namespace Voucher.FlashSales {
    @get
    @route("")
    @operationId("getFlashSales")
    @tag("flash-sales")
    op getFlashSales(): GetFlashSalesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postFlashSale")
    @tag("flash-sales")
    op postFlashSale(@body body: PostFlashSaleRequestBody):
        | PostFlashSaleResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{flashSaleId}")
    @operationId("getFlashSaleById")
    @tag("flash-sales")
    op getFlashSaleById(
        @path flashSaleId: UUID,
    ): GetFlashSaleByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{flashSaleId}")
    @operationId("patchFlashSale")
    @tag("flash-sales")
    op patchFlashSale(
        @path flashSaleId: UUID,
        @body body: PatchFlashSaleRequestBody,
    ):
        | PatchFlashSaleResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{flashSaleId}")
    @operationId("deleteFlashSale")
    @tag("flash-sales")
    op deleteFlashSale(@path flashSaleId: UUID):
        | DeleteFlashSaleResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
