import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    cartId: "123e4567-e89b-12d3-a456-426614174400",
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    quantity: 2,
})
model CartItemResponse {
    cartId: UUID;
    productVariantId: UUID;
    quantity: int32;
}

model PostCartItemRequestBody {
    productVariantId: UUID;
    quantity?: int32;
}

model PostCartItemResponseBody {
    cartId: UUID;
    productVariantId: UUID;
}

model PatchCartItemRequestBody {
    quantity?: int32;
}

model CartItemsResponse {
    cartItems: CartItemResponse[];
}

model GetCartItemsResponse200 {
    @statusCode statusCode: 200;
    @body body: CartItemsResponse;
}

model PostCartItemResponse {
    @statusCode statusCode: 201;
    @body body: PostCartItemResponseBody;
}

model PatchCartItemResponse {
    @statusCode statusCode: 204;
}

model DeleteCartItemResponse {
    @statusCode statusCode: 204;
}
