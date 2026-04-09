import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/products")
namespace Product.Products {
    @get
    @route("/{productId}")
    @operationId("getProductByProductId")
    @tag("products")
    op getProductByProductId(
        @path productId: UUID,
    ): GetProductByProductIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getProducts")
    @tag("products")
    op getProducts(
        ...GetProductRequestParams,
    ): GetProductsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postProduct")
    @tag("products")
    op postProduct(@body body: PostProductRequestBody):
        | PostProductResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @patch
    @route("/{productId}")
    @operationId("patchProduct")
    @tag("products")
    op patchProduct(
        @path productId: UUID,
        @body body: PatchProductRequestBody,
    ):
        | PatchProductResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{productId}")
    @operationId("deleteProduct")
    @tag("products")
    op deleteProduct(@path productId: UUID):
        | DeleteProductResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
