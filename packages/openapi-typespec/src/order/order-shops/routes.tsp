import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/orders")
namespace Order.OrderShops {
    @get
    @route("/{orderId}/shops")
    @operationId("getOrderShops")
    @tag("order-shops")
    op getOrderShops(
        @path orderId: UUID,
    ): GetOrderShopsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{orderId}/shops")
    @operationId("postOrderShop")
    @tag("order-shops")
    op postOrderShop(
        @path orderId: UUID,
        @body body: PostOrderShopRequestBody,
    ):
        | PostOrderShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{orderId}/shops/{orderShopId}")
    @operationId("getOrderShopById")
    @tag("order-shops")
    op getOrderShopById(
        @path orderId: UUID,
        @path orderShopId: UUID,
    ): GetOrderShopByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{orderId}/shops/{orderShopId}")
    @operationId("patchOrderShop")
    @tag("order-shops")
    op patchOrderShop(
        @path orderId: UUID,
        @path orderShopId: UUID,
        @body body: PatchOrderShopRequestBody,
    ):
        | PatchOrderShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{orderId}/shops/{orderShopId}")
    @operationId("deleteOrderShop")
    @tag("order-shops")
    op deleteOrderShop(@path orderId: UUID, @path orderShopId: UUID):
        | DeleteOrderShopResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
