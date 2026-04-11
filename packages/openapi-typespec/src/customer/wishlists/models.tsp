import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    wishlistId: "123e4567-e89b-12d3-a456-426614174900",
    userId: "123e4567-e89b-12d3-a456-426614174700",
})
model WishlistResponse {
    wishlistId: UUID;
    userId: UUID;
}

model PostWishlistRequestBody {
    userId: UUID;
}

model PostWishlistResponseBody {
    wishlistId: UUID;
}

model WishlistsResponse {
    wishlists: WishlistResponse[];
}

model GetWishlistsResponse200 {
    @statusCode statusCode: 200;
    @body body: WishlistsResponse;
}

model GetWishlistByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: WishlistResponse;
}

model PostWishlistResponse {
    @statusCode statusCode: 201;
    @body body: PostWishlistResponseBody;
}

model DeleteWishlistResponse {
    @statusCode statusCode: 204;
}
