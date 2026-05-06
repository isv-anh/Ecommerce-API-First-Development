import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    orderItemId: "123e4567-e89b-12d3-a456-426614174C00",
    orderId: "123e4567-e89b-12d3-a456-426614174B00",
    shopId: "123e4567-e89b-12d3-a456-426614174D00",
    productId: "123e4567-e89b-12d3-a456-426614174000",
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    productName: "iPhone 14 Pro Max",
    variantName: "256GB Black",
    price: 25000000,
    quantity: 2,
    totalPrice: 50000000,
})
model OrderItemResponse {
    orderItemId: UUID;
    orderId: UUID;
    shopId: UUID;
    productId: UUID;
    productVariantId: UUID;
    productName: NonEmptyString;
    variantName: string;
    price: decimal;
    quantity: int32;
    totalPrice: decimal;
}

model PostOrderItemRequestBody {
    shopId: UUID;
    productId: UUID;
    productVariantId: UUID;
    productName: NonEmptyString;
    variantName?: string;
    price: decimal;
    quantity: int32;
}

model PostOrderItemResponseBody {
    orderItemId: UUID;
}

model PatchOrderItemRequestBody {
    quantity?: int32;
}

model OrderItemsResponse {
    orderItems: OrderItemResponse[];
}

model GetOrderItemsResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderItemsResponse;
}

model GetOrderItemByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderItemResponse;
}

model PostOrderItemResponse {
    @statusCode statusCode: 201;
    @body body: PostOrderItemResponseBody;
}

model PatchOrderItemResponse {
    @statusCode statusCode: 204;
}

model DeleteOrderItemResponse {
    @statusCode statusCode: 204;
}
