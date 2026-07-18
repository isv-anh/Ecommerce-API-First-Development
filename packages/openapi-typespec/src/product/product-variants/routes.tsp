import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/product-variants")
namespace Product.ProductVariants {
    @get
    @route("/{productVariantId}")
    @operationId("getProductVariantById")
    @tag("product-variants")
    @extension("x-public", true)
    op getProductVariantById(
        @path productVariantId: UUID,
    ): GetProductVariantByIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getProductVariants")
    @tag("product-variants")
    @extension("x-public", true)
    op getProductVariants(
        @query productId?: UUID,
    ): GetProductVariantsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postProductVariant")
    @tag("product-variants")
    op postProductVariant(
        @body body: PostProductVariantRequestBody,
    ): PostProductVariantResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @patch
    @route("/{productVariantId}")
    @operationId("patchProductVariant")
    @tag("product-variants")
    op patchProductVariant(
        @path productVariantId: UUID,
        @body body: PatchProductVariantRequestBody,
    ): PatchProductVariantResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @delete
    @route("/{productVariantId}")
    @operationId("deleteProductVariant")
    @tag("product-variants")
    op deleteProductVariant(
        @path productVariantId: UUID,
    ): DeleteProductVariantResponse | UnauthorizedError | BadRequestError | InternalServerError;
}
