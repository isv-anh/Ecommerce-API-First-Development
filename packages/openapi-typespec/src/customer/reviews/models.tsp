import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    reviewId: "123e4567-e89b-12d3-a456-426614174800",
    userId: "123e4567-e89b-12d3-a456-426614174700",
    productId: "123e4567-e89b-12d3-a456-426614174000",
    rating: 5,
    comment: "Sản phẩm rất tốt, mua lần sau chắc chắn!",
})
model ReviewResponse {
    reviewId: UUID;
    userId: UUID;
    productId: UUID;
    rating: int32;
    comment?: string;
}

model PostReviewRequestBody {
    userId: UUID;
    productId: UUID;
    rating: int32;
    comment?: string;
}

model PostReviewResponseBody {
    reviewId: UUID;
}

model PatchReviewRequestBody {
    rating?: int32;
    comment?: string;
}

model ReviewsResponse {
    reviews: ReviewResponse[];
}

model GetReviewsResponse200 {
    @statusCode statusCode: 200;
    @body body: ReviewsResponse;
}

model GetReviewByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ReviewResponse;
}

model PostReviewResponse {
    @statusCode statusCode: 201;
    @body body: PostReviewResponseBody;
}

model PatchReviewResponse {
    @statusCode statusCode: 204;
}

model DeleteReviewResponse {
    @statusCode statusCode: 204;
}
