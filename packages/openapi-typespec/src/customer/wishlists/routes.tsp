import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/customers/wishlists")
namespace Customer.Wishlists {
    @get
    @route("")
    @operationId("getWishlists")
    @tag("customer-wishlists")
    op getWishlists(
        @query userId?: UUID,
    ): GetWishlistsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postWishlist")
    @tag("customer-wishlists")
    op postWishlist(@body body: PostWishlistRequestBody):
        | PostWishlistResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{wishlistId}")
    @operationId("getWishlistById")
    @tag("customer-wishlists")
    op getWishlistById(
        @path wishlistId: UUID,
    ): GetWishlistByIdResponse200 | BadRequestError | InternalServerError;

    @delete
    @route("/{wishlistId}")
    @operationId("deleteWishlist")
    @tag("customer-wishlists")
    op deleteWishlist(@path wishlistId: UUID):
        | DeleteWishlistResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
