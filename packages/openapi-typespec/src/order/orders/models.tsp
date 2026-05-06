import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    orderId: "123e4567-e89b-12d3-a456-426614174B00",
    userId: "123e4567-e89b-12d3-a456-426614174500",
    status: "pending",
    totalAmount: 100000,
    totalDiscount: 0,
    finalAmount: 100000,
    createdAt: "2026-04-09T08:00:00.000Z",
})
model OrderResponse {
    orderId: UUID;
    userId: UUID;
    status: string;
    totalAmount: decimal;
    totalDiscount: decimal;
    finalAmount: decimal;
    createdAt: string;
}

model PostOrderRequestBody {
    userId: UUID;
}

model PostOrderResponseBody {
    orderId: UUID;
}

model OrdersResponse {
    orders: OrderResponse[];
}

model GetOrdersResponse200 {
    @statusCode statusCode: 200;
    @body body: OrdersResponse;
}

model GetOrderByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderResponse;
}

model PostOrderResponse {
    @statusCode statusCode: 201;
    @body body: PostOrderResponseBody;
}

model DeleteOrderResponse {
    @statusCode statusCode: 204;
}
