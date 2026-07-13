import "@typespec/http";
import "@typespec/openapi";
import "../products/models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/user/products")
namespace Product.UserProducts {
    @get
    @route("")
    @operationId("getUserProducts")
    @tag("user-products")
    @extension("x-public", true)
    op getUserProducts(
        ...GetProductRequestParams,
    ): GetProductsResponse200 | BadRequestError | InternalServerError;
}
