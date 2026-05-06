import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/product-images")
namespace Product.ProductImages {
    @get
    @route("/{productImageId}")
    @operationId("getProductImageById")
    @tag("product-images")
    op getProductImageById(
        @path productImageId: UUID,
    ): GetProductImagesResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getProductImages")
    @tag("product-images")
    op getProductImages(
        @query productId?: UUID,
    ): GetProductImagesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postProductImage")
    @tag("product-images")
    op postProductImage(
        @body body: PostProductImageRequestBody,
    ): PostProductImageResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @patch
    @route("/{productImageId}")
    @operationId("patchProductImage")
    @tag("product-images")
    op patchProductImage(
        @path productImageId: UUID,
        @body body: PatchProductImageRequestBody,
    ): PatchProductImageResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @delete
    @route("/{productImageId}")
    @operationId("deleteProductImage")
    @tag("product-images")
    op deleteProductImage(
        @path productImageId: UUID,
    ): DeleteProductImageResponse | UnauthorizedError | BadRequestError | InternalServerError;
}
