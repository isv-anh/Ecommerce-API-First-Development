import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/customers/wishlists")
namespace Customer.WishlistItems {
    @get
    @route("/{wishlistId}/items")
    @operationId("getWishlistItems")
    @tag("customer-wishlist-items")
    op getWishlistItems(
        @path wishlistId: UUID,
    ): GetWishlistItemsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{wishlistId}/items")
    @operationId("postWishlistItem")
    @tag("customer-wishlist-items")
    op postWishlistItem(
        @path wishlistId: UUID,
        @body body: PostWishlistItemRequestBody,
    ):
        | PostWishlistItemResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{wishlistId}/items/{wishlistItemId}")
    @operationId("deleteWishlistItem")
    @tag("customer-wishlist-items")
    op deleteWishlistItem(@path wishlistId: UUID, @path wishlistItemId: UUID):
        | DeleteWishlistItemResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
