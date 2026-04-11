import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    wishlistItemId: "123e4567-e89b-12d3-a456-426614174A00",
    wishlistId: "123e4567-e89b-12d3-a456-426614174900",
    productId: "123e4567-e89b-12d3-a456-426614174000",
})
model WishlistItemResponse {
    wishlistItemId: UUID;
    wishlistId: UUID;
    productId: UUID;
}

model PostWishlistItemRequestBody {
    productId: UUID;
}

model PostWishlistItemResponseBody {
    wishlistItemId: UUID;
}

model WishlistItemsResponse {
    wishlistItems: WishlistItemResponse[];
}

model GetWishlistItemsResponse200 {
    @statusCode statusCode: 200;
    @body body: WishlistItemsResponse;
}

model PostWishlistItemResponse {
    @statusCode statusCode: 201;
    @body body: PostWishlistItemResponseBody;
}

model DeleteWishlistItemResponse {
    @statusCode statusCode: 204;
}
