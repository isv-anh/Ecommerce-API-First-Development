import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/carts")
namespace Cart.CartItems {
    @get
    @route("/{cartId}/items")
    @operationId("getCartItems")
    @tag("cart-items")
    op getCartItems(
        @path cartId: UUID,
    ): GetCartItemsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{cartId}/items")
    @operationId("postCartItem")
    @tag("cart-items")
    op postCartItem(
        @path cartId: UUID,
        @body body: PostCartItemRequestBody,
    ): PostCartItemResponse | BadRequestError | InternalServerError;

    @patch
    @route("/{cartId}/items/{productVariantId}")
    @operationId("patchCartItem")
    @tag("cart-items")
    op patchCartItem(
        @path cartId: UUID,
        @path productVariantId: UUID,
        @body body: PatchCartItemRequestBody,
    ): PatchCartItemResponse | BadRequestError | InternalServerError;

    @delete
    @route("/{cartId}/items/{productVariantId}")
    @operationId("deleteCartItem")
    @tag("cart-items")
    op deleteCartItem(
        @path cartId: UUID,
        @path productVariantId: UUID,
    ): DeleteCartItemResponse | BadRequestError | InternalServerError;
}
