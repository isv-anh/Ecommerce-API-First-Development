import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/shops")
namespace Shop.Shops {
    @get
    @route("/me")
    @operationId("getShopMe")
    @tag("shops")
    op getShopMe(): GetShopsResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getShops")
    @tag("shops")
    op getShops(
        ...GetShopsRequestParams,
    ): GetShopsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postShop")
    @tag("shops")
    op postShop(@body body: PostShopRequestBody):
        | PostShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{shopId}")
    @operationId("getShopById")
    @tag("shops")
    op getShopById(
        @path shopId: UUID,
    ): GetShopByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{shopId}")
    @operationId("patchShop")
    @tag("shops")
    op patchShop(@path shopId: UUID, @body body: PatchShopRequestBody):
        | PatchShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{shopId}")
    @operationId("deleteShop")
    @tag("shops")
    op deleteShop(@path shopId: UUID):
        | DeleteShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
