import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    warehouseId: "123e4567-e89b-12d3-a456-426614174200",
    productVariantId: "123e4567-e89b-12d3-a456-426614174100",
    stock: 100,
})
model WarehouseInventoryResponse {
    warehouseId: UUID;
    productVariantId: UUID;
    stock: int32;
}

model PostWarehouseInventoryRequestBody {
    warehouseId: UUID;
    productVariantId: UUID;
    stock: int32;
}

model PostWarehouseInventoryResponseBody {
    warehouseId: UUID;
    productVariantId: UUID;
}

model PatchWarehouseInventoryRequestBody {
    stock?: int32;
}

model WarehouseInventoriesResponse {
    warehouseInventories: WarehouseInventoryResponse[];
}

// ----- API Responses -----

model GetWarehouseInventoriesResponse200 {
    @statusCode statusCode: 200;
    @body body: WarehouseInventoriesResponse;
}

model GetWarehouseInventoryByIdsResponse200 {
    @statusCode statusCode: 200;
    @body body: WarehouseInventoryResponse;
}

model PostWarehouseInventoryResponse {
    @statusCode statusCode: 201;
    @body body: PostWarehouseInventoryResponseBody;
}

model PatchWarehouseInventoryResponse {
    @statusCode statusCode: 204;
}

model DeleteWarehouseInventoryResponse {
    @statusCode statusCode: 204;
}
