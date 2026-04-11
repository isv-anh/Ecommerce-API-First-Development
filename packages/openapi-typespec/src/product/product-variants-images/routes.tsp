import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/product-variant-images")
namespace Product.ProductVariantImages {
    @get
    @route("/{productVariantImageId}")
    @operationId("getProductVariantImageById")
    @tag("product-variant-images")
    op getProductVariantImageById(
        @path productVariantImageId: UUID,
    ): GetProductVariantImageByIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getProductVariantImages")
    @tag("product-variant-images")
    op getProductVariantImages(
        @query productVariantId?: UUID,
    ): GetProductVariantImagesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postProductVariantImage")
    @tag("product-variant-images")
    op postProductVariantImage(
        @body body: PostProductVariantImageRequestBody,
    ): PostProductVariantImageResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @patch
    @route("/{productVariantImageId}")
    @operationId("patchProductVariantImage")
    @tag("product-variant-images")
    op patchProductVariantImage(
        @path productVariantImageId: UUID,
        @body body: PatchProductVariantImageRequestBody,
    ): PatchProductVariantImageResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @delete
    @route("/{productVariantImageId}")
    @operationId("deleteProductVariantImage")
    @tag("product-variant-images")
    op deleteProductVariantImage(
        @path productVariantImageId: UUID,
    ): DeleteProductVariantImageResponse | UnauthorizedError | BadRequestError | InternalServerError;
}
