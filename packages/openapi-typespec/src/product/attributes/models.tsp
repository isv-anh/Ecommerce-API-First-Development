import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "@typespec/http";

using TypeSpec.Http;

model PostAttributeRequestBody {
    attributeName: NonEmptyString;
}

model PostAttributeResponseBody {
    attributeId: UUID;
}

model PatchAttributeRequestBody {
    attributeName?: NonEmptyString;
}

model AttributeResponse {
    attributeId: UUID;
    attributeName: string;
}

model AttributesResponse {
    ...PageResponse;
    attributes: AttributeResponse[];
}

model GetAttributesRequestParams extends PageQueryParams {
    @query
    attributeName?: string;
}

model GetAttributesResponse200 {
    @statusCode statusCode: 200;
    @body body: AttributesResponse;
}

model GetAttributeByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: AttributeResponse;
}

model PostAttributeResponse {
    @statusCode statusCode: 201;
    @body body: PostAttributeResponseBody;
}

model PatchAttributeResponse {
    @statusCode statusCode: 204;
}

model DeleteAttributeResponse {
    @statusCode statusCode: 204;
}
