import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/product-attributes")
namespace Product.ProductAttributes {
    @get
    @route("/{productId}/{attributeId}")
    @operationId("getProductAttributeById")
    @tag("product-attributes")
    op getProductAttributeById(@path productId: UUID, @path attributeId: UUID):
        | GetProductAttributeByIdResponse200
        | BadRequestError
        | InternalServerError;

    @get
    @route("")
    @operationId("getProductAttributes")
    @tag("product-attributes")
    op getProductAttributes(@query productId?: UUID):
        | GetProductAttributesResponse200
        | BadRequestError
        | InternalServerError;

    @post
    @route("")
    @operationId("postProductAttribute")
    @tag("product-attributes")
    op postProductAttribute(@body body: PostProductAttributeRequestBody):
        | PostProductAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @patch
    @route("/{productId}/{attributeId}")
    @operationId("patchProductAttribute")
    @tag("product-attributes")
    op patchProductAttribute(
        @path productId: UUID,
        @path attributeId: UUID,
        @body body: PatchProductAttributeRequestBody,
    ):
        | PatchProductAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{productId}/{attributeId}")
    @operationId("deleteProductAttribute")
    @tag("product-attributes")
    op deleteProductAttribute(@path productId: UUID, @path attributeId: UUID):
        | DeleteProductAttributeResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
