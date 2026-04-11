import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    productVariantImageId: "123e4567-e89b-12d3-a456-426614174800",
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    url: "https://example.com/images/variants/galaxy-s22-black-1.jpg",
    isThumbnail: false,
    sortOrder: 0,
    createdAt: "2026-04-09T08:00:00.000Z",
})
model ProductVariantImageResponse {
    productVariantImageId: UUID;
    productVariantId: UUID;
    url: NonEmptyString;
    isThumbnail: boolean;
    sortOrder: int32;
    createdAt: string;
}

model PostProductVariantImageRequestBody {
    productVariantId: UUID;
    url: NonEmptyString;
    isThumbnail?: boolean;
    sortOrder?: int32;
}

model PostProductVariantImageResponseBody {
    productVariantImageId: UUID;
}

model PatchProductVariantImageRequestBody {
    url?: NonEmptyString;
    isThumbnail?: boolean;
    sortOrder?: int32;
}

model ProductVariantImagesResponse {
    productVariantImages: ProductVariantImageResponse[];
}

// ----- API Responses -----

model GetProductVariantImagesResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductVariantImagesResponse;
}

model GetProductVariantImageByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductVariantImageResponse;
}

model PostProductVariantImageResponse {
    @statusCode statusCode: 201;
    @body body: PostProductVariantImageResponseBody;
}

model PatchProductVariantImageResponse {
    @statusCode statusCode: 204;
}

model DeleteProductVariantImageResponse {
    @statusCode statusCode: 204;
}
