import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    productId: "123e4567-e89b-12d3-a456-426614174000",
    sku: "SKU-GALAXY-S22-BLACK-256",
    thumbnailUrl: "https://example.com/images/variants/galaxy-s22-black.jpg",
    price: 1199,
    comparePrice: 1299,
    stock: 50,
    createdAt: "2026-04-09T08:00:00.000Z",
    updatedAt: "2026-04-09T08:00:00.000Z",
})
model ProductVariantResponse {
    productVariantId: UUID;
    productId: UUID;
    sku: NonEmptyString;
    thumbnailUrl: string;
    price: decimal;
    comparePrice: decimal;
    stock: int32;
    createdAt: string;
    updatedAt: string;
}

model PostProductVariantRequestBody {
    productId: UUID;
    sku: NonEmptyString;
    thumbnailUrl?: string;
    price: decimal;
    comparePrice?: decimal;
    stock?: int32;
}

model PostProductVariantResponseBody {
    productVariantId: UUID;
}

model PatchProductVariantRequestBody {
    sku?: NonEmptyString;
    thumbnailUrl?: string;
    price?: decimal;
    comparePrice?: decimal;
    stock?: int32;
}

model ProductVariantsResponse {
    productVariants: ProductVariantResponse[];
}

// ----- API Responses -----

model GetProductVariantsResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductVariantsResponse;
}

model GetProductVariantByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductVariantResponse;
}

model PostProductVariantResponse {
    @statusCode statusCode: 201;
    @body body: PostProductVariantResponseBody;
}

model PatchProductVariantResponse {
    @statusCode statusCode: 204;
}

model DeleteProductVariantResponse {
    @statusCode statusCode: 204;
}
