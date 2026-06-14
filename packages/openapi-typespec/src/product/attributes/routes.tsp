import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/attributes")
namespace Product.Attributes {
    @get
    @route("/{attributeId}")
    @operationId("getAttributeById")
    @tag("attributes")
    op getAttributeById(@path attributeId: UUID):
        | GetAttributeByIdResponse200
        | BadRequestError
        | InternalServerError;

    @get
    @route("")
    @operationId("getAttributes")
    @tag("attributes")
    op getAttributes(...GetAttributesRequestParams):
        | GetAttributesResponse200
        | BadRequestError
        | InternalServerError;

    @post
    @route("")
    @operationId("postAttributes")
    @tag("attributes")
    op postAttribute(@body body: PostAttributeRequestBody):
        | PostAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @patch
    @route("/{attributeId}")
    @operationId("patchAttribute")
    @tag("attributes")
    op patchAttribute(
        @path attributeId: UUID,
        @body body: PatchAttributeRequestBody,
    ):
        | PatchAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{attributeId}")
    @operationId("deleteAttribute")
    @tag("attributes")
    op deleteAttribute(@path attributeId: UUID):
        | DeleteAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
