import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/brands")
namespace Product.Brands {
    @get
    @route("/{brandId}")
    @operationId("getBrandByBrandId")
    @tag("brands")
    op getBrandByBrandId(
        @path brandId: UUID,
    ): GetBrandByBrandIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getBrands")
    @tag("brands")
    op getbrands(
        ...GetBrandRequestParams,
    ): GetBrandsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postBrand")
    @tag("brands")
    op postBrand(@body body: PostBrandRequestBody):
        | PostBrandResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @patch
    @route("/{brandId}")
    @operationId("patchBrand")
    @tag("brands")
    op patchBrand(@path brandId: UUID, @body body: PatchBrandRequestBody):
        | PatchBrandResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{brandId}")
    @operationId("deleteBrand")
    @tag("brands")
    op deleteBrand(@path brandId: UUID):
        | DeleteBrandResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
