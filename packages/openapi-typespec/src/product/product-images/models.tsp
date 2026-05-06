import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    productImageId: "123e4567-e89b-12d3-a456-426614174900",
    productId: "123e4567-e89b-12d3-a456-426614174000",
    url: "https://example.com/images/abc.jpg",
    isThumbnail: false,
    sortOrder: 0,
    createdAt: "2026-04-09T08:00:00.000Z",
})
model ProductImageResponse {
    productImageId: UUID;
    productId: UUID;
    url: NonEmptyString;
    isThumbnail: boolean;
    sortOrder: int32;
    createdAt: string; // hoặc DateTime nếu có định nghĩa ở scalars
}

model PostProductImageRequestBody {
    productId: UUID;
    url: NonEmptyString;
    isThumbnail?: boolean;
    sortOrder?: int32;
}

model PostProductImageResponseBody {
    productImageId: UUID;
}

model PatchProductImageRequestBody {
    url?: NonEmptyString;
    isThumbnail?: boolean;
    sortOrder?: int32;
}

model ProductImagesResponse {
    productImages: ProductImageResponse[];
}

// ----- API Responses -----

model GetProductImagesResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductImagesResponse;
}

model PostProductImageResponse {
    @statusCode statusCode: 201;
    @body body: PostProductImageResponseBody;
}

model PatchProductImageResponse {
    @statusCode statusCode: 204;
}

model DeleteProductImageResponse {
    @statusCode statusCode: 204;
}
