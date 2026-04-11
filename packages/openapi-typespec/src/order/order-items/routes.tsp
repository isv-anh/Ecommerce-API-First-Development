import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/orders")
namespace Order.OrderItems {
    @get
    @route("/{orderId}/items")
    @operationId("getOrderItems")
    @tag("order-items")
    op getOrderItems(
        @path orderId: UUID,
    ): GetOrderItemsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/{orderId}/items")
    @operationId("postOrderItem")
    @tag("order-items")
    op postOrderItem(
        @path orderId: UUID,
        @body body: PostOrderItemRequestBody,
    ):
        | PostOrderItemResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{orderId}/items/{orderItemId}")
    @operationId("getOrderItemById")
    @tag("order-items")
    op getOrderItemById(
        @path orderId: UUID,
        @path orderItemId: UUID,
    ): GetOrderItemByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{orderId}/items/{orderItemId}")
    @operationId("patchOrderItem")
    @tag("order-items")
    op patchOrderItem(
        @path orderId: UUID,
        @path orderItemId: UUID,
        @body body: PatchOrderItemRequestBody,
    ):
        | PatchOrderItemResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{orderId}/items/{orderItemId}")
    @operationId("deleteOrderItem")
    @tag("order-items")
    op deleteOrderItem(@path orderId: UUID, @path orderItemId: UUID):
        | DeleteOrderItemResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
