import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/orders")
namespace Order.Orders {
    @post
    @route("/{orderId}/cancel")
    @operationId("cancelOrder")
    @tag("orders")
    op cancelOrder(@path orderId: UUID):
        | CancelOrderResponse
        | UnauthorizedError
        | ForbiddenError
        | NotFoundError
        | BadRequestError
        | InternalServerError;

    @get
    @route("")
    @operationId("getOrders")
    @tag("orders")
    op getOrders(
        ...GetOrdersQueryParams,
    ): GetOrdersResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postOrder")
    @tag("orders")
    op postOrder(@body body: PostOrderRequestBody):
        | PostOrderResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{orderId}")
    @operationId("getOrderById")
    @tag("orders")
    op getOrderById(
        @path orderId: UUID,
    ): GetOrderByIdResponse200 | BadRequestError | InternalServerError;

    @delete
    @route("/{orderId}")
    @operationId("deleteOrder")
    @tag("orders")
    op deleteOrder(@path orderId: UUID):
        | DeleteOrderResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
