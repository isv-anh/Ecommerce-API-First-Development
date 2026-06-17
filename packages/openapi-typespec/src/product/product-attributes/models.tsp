import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

model ProductAttributeResponse {
    productId: UUID;
    attributeId: UUID;
    attributeName: NonEmptyString;
}

model PostProductAttributeRequestBody {
    productId: UUID;
    attributeId: UUID;
}

model PostProductAttributeResponseBody {
    productId: UUID;
    attributeId: UUID;
}

model PatchProductAttributeRequestBody {
    attributeId: UUID;
}

model ProductAttributesResponse {
    productAttributes: ProductAttributeResponse[];
}

// ----- API Responses -----

model GetProductAttributesResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductAttributesResponse;
}

model GetProductAttributeByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductAttributeResponse;
}

model PostProductAttributeResponse {
    @statusCode statusCode: 201;
    @body body: PostProductAttributeResponseBody;
}

model PatchProductAttributeResponse {
    @statusCode statusCode: 204;
}

model DeleteProductAttributeResponse {
    @statusCode statusCode: 204;
}
