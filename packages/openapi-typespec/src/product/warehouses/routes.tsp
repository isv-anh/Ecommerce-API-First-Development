import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/warehouses")
namespace Product.Warehouses {
    @get
    @route("/{warehouseId}")
    @operationId("getWarehouseById")
    @tag("warehouses")
    op getWarehouseById(
        @path warehouseId: UUID,
    ): GetWarehouseByIdResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getWarehouses")
    @tag("warehouses")
    op getWarehouses(): GetWarehousesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postWarehouse")
    @tag("warehouses")
    op postWarehouse(
        @body body: PostWarehouseRequestBody,
    ): PostWarehouseResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @patch
    @route("/{warehouseId}")
    @operationId("patchWarehouse")
    @tag("warehouses")
    op patchWarehouse(
        @path warehouseId: UUID,
        @body body: PatchWarehouseRequestBody,
    ): PatchWarehouseResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @delete
    @route("/{warehouseId}")
    @operationId("deleteWarehouse")
    @tag("warehouses")
    op deleteWarehouse(
        @path warehouseId: UUID,
    ): DeleteWarehouseResponse | UnauthorizedError | BadRequestError | InternalServerError;
}
