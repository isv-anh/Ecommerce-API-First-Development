import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/carts")
namespace Cart.Carts {
    @get
    @route("")
    @operationId("getCart")
    @tag("carts")
    op getCart(
        @query userId: UUID,
    ): GetCartResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postCart")
    @tag("carts")
    op postCart(
        @body body: PostCartRequestBody,
    ): PostCartResponse | BadRequestError | InternalServerError;

    @delete
    @route("/{cartId}")
    @operationId("deleteCart")
    @tag("carts")
    op deleteCart(
        @path cartId: UUID,
    ): DeleteCartResponse | BadRequestError | InternalServerError;
}
