import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    warehouseId: "123e4567-e89b-12d3-a456-426614174200",
    shopId: "123e4567-e89b-12d3-a456-426614174300",
    name: "Main Warehouse",
    address: "123 Industrial Street, Hanoi, Vietnam",
    createdAt: "2026-04-09T08:00:00.000Z",
})
model Warehouse {
    warehouseId: UUID;
    shopId: UUID;
    name: NonEmptyString;
    address: string;
    createdAt: string;
}

model PostWarehouseRequestBody {
    shopId: UUID;
    name: NonEmptyString;
    address?: string;
}

model PostWarehouseResponseBody {
    warehouseId: UUID;
}

model PatchWarehouseRequestBody {
    name?: NonEmptyString;
    address?: string;
}

model WarehousesResponse {
    warehouses: Warehouse[];
}

// ----- API Responses -----

model GetWarehousesResponse200 {
    @statusCode statusCode: 200;
    @body body: WarehousesResponse;
}

model GetWarehouseByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: Warehouse;
}

model PostWarehouseResponse {
    @statusCode statusCode: 201;
    @body body: PostWarehouseResponseBody;
}

model PatchWarehouseResponse {
    @statusCode statusCode: 204;
}

model DeleteWarehouseResponse {
    @statusCode statusCode: 204;
}
