import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    cartId: "123e4567-e89b-12d3-a456-426614174400",
    userId: "123e4567-e89b-12d3-a456-426614174500",
    updatedAt: "2026-04-09T08:00:00.000Z",
})
model CartResponse {
    cartId: UUID;
    userId: UUID;
    updatedAt: string;
}

model PostCartRequestBody {
    userId: UUID;
}

model PostCartResponseBody {
    cartId: UUID;
}

model GetCartResponse200 {
    @statusCode statusCode: 200;
    @body body: CartResponse;
}

model PostCartResponse {
    @statusCode statusCode: 201;
    @body body: PostCartResponseBody;
}

model DeleteCartResponse {
    @statusCode statusCode: 204;
}
