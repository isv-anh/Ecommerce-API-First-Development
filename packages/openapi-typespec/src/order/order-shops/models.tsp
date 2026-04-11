import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    orderShopId: "123e4567-e89b-12d3-a456-426614174E00",
    orderId: "123e4567-e89b-12d3-a456-426614174B00",
    shopId: "123e4567-e89b-12d3-a456-426614174D00",
    subtotal: 50000000,
    discount: 0,
    finalAmount: 50000000,
    status: "pending",
})
model OrderShopResponse {
    orderShopId: UUID;
    orderId: UUID;
    shopId: UUID;
    subtotal: decimal;
    discount: decimal;
    finalAmount: decimal;
    status: string;
}

model PostOrderShopRequestBody {
    shopId: UUID;
    subtotal?: decimal;
    discount?: decimal;
    finalAmount?: decimal;
    status?: string;
}

model PostOrderShopResponseBody {
    orderShopId: UUID;
}

model PatchOrderShopRequestBody {
    subtotal?: decimal;
    discount?: decimal;
    finalAmount?: decimal;
    status?: string;
}

model OrderShopsResponse {
    orderShops: OrderShopResponse[];
}

model GetOrderShopsResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderShopsResponse;
}

model GetOrderShopByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderShopResponse;
}

model PostOrderShopResponse {
    @statusCode statusCode: 201;
    @body body: PostOrderShopResponseBody;
}

model PatchOrderShopResponse {
    @statusCode statusCode: 204;
}

model DeleteOrderShopResponse {
    @statusCode statusCode: 204;
}
