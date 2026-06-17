import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

model ProductVariantResponse {
    productVariantId: UUID;
    productId: UUID;
    sku: NonEmptyString;
    thumbnailUrl: string;
    price: decimal;
    comparePrice: decimal;
    stock: int32;

    @minItems(1)
    variantAttributes: VariantAttribute[];
}

model VariantAttribute {
    attributeId: UUID;
    attributeName: string;
    attributeValue: NonEmptyString;
}

model PostProductVariantRequestBody {
    productId: UUID;
    sku: NonEmptyString;
    thumbnailUrl?: string | null;

    @minValue(0)
    price: decimal;

    @minValue(0)
    comparePrice?: decimal | null;

    @minItems(1)
    variantAttributes: VariantAttribute[];
}

model PostProductVariantResponseBody {
    productVariantId: UUID;
}

model PatchProductVariantRequestBody {
    sku?: NonEmptyString | null;
    thumbnailUrl?: string | null;
    price?: decimal | null;
    comparePrice?: decimal | null;
    variantAttributes?: VariantAttribute[];
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
