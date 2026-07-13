import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/categories")
namespace Product.Categories {
    @get
    @route("/{categoryId}")
    @operationId("getCategoryByCategoryId")
    @tag("categories")
    op getCategoryByCategoryId(
        @path categoryId: UUID,
    ): GetCategoryByCategoryIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getCategories")
    @tag("categories")
    @extension("x-public", true)
    op getCategories(
        ...GetCategoryRequestParams,
    ): GetCategoriesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postCategory")
    @tag("categories")
    op postCategory(@body body: PostCategoryRequestBody):
        | PostCategoryResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @patch
    @route("/{categoryId}")
    @operationId("patchCategory")
    @tag("categories")
    op patchCategory(
        @path categoryId: UUID,
        @body body: PatchCategoryRequestBody,
    ):
        | PatchCategoryResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{categoryId}")
    @operationId("deleteCategory")
    @tag("categories")
    op deleteCategory(@path categoryId: UUID):
        | DeleteCategoryResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
