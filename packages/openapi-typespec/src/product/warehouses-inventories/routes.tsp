import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/warehouse-inventories")
namespace Product.WarehouseInventories {
    @get
    @route("/{warehouseId}/{productVariantId}")
    @operationId("getWarehouseInventoryByIds")
    @tag("warehouse-inventories")
    op getWarehouseInventoryByIds(
        @path warehouseId: UUID,
        @path productVariantId: UUID,
    ): GetWarehouseInventoryByIdsResponse200 | BadRequestError | InternalServerError;

    @get
    @route("")
    @operationId("getWarehouseInventories")
    @tag("warehouse-inventories")
    op getWarehouseInventories(
        @query warehouseId?: UUID,
        @query productVariantId?: UUID,
    ): GetWarehouseInventoriesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postWarehouseInventory")
    @tag("warehouse-inventories")
    op postWarehouseInventory(
        @body body: PostWarehouseInventoryRequestBody,
    ): PostWarehouseInventoryResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @patch
    @route("/{warehouseId}/{productVariantId}")
    @operationId("patchWarehouseInventory")
    @tag("warehouse-inventories")
    op patchWarehouseInventory(
        @path warehouseId: UUID,
        @path productVariantId: UUID,
        @body body: PatchWarehouseInventoryRequestBody,
    ): PatchWarehouseInventoryResponse | UnauthorizedError | BadRequestError | InternalServerError;

    @delete
    @route("/{warehouseId}/{productVariantId}")
    @operationId("deleteWarehouseInventory")
    @tag("warehouse-inventories")
    op deleteWarehouseInventory(
        @path warehouseId: UUID,
        @path productVariantId: UUID,
    ): DeleteWarehouseInventoryResponse | UnauthorizedError | BadRequestError | InternalServerError;
}
