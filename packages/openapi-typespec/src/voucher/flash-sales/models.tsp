import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    flashSaleId: "123e4567-e89b-12d3-a456-426614175700",
    name: "Flash Sale Điện Thoại",
    startTime: "2026-04-15T00:00:00.000Z",
    endTime: "2026-04-15T23:59:59.000Z",
})
model FlashSaleResponse {
    flashSaleId: UUID;
    name: NonEmptyString;
    startTime: string;
    endTime: string;
}

model PostFlashSaleRequestBody {
    name: NonEmptyString;
    startTime: string;
    endTime: string;
}

model PostFlashSaleResponseBody {
    flashSaleId: UUID;
}

model PatchFlashSaleRequestBody {
    name?: NonEmptyString;
    startTime?: string;
    endTime?: string;
}

model FlashSalesResponse {
    flashSales: FlashSaleResponse[];
}

model GetFlashSalesResponse200 {
    @statusCode statusCode: 200;
    @body body: FlashSalesResponse;
}

model GetFlashSaleByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: FlashSaleResponse;
}

model PostFlashSaleResponse {
    @statusCode statusCode: 201;
    @body body: PostFlashSaleResponseBody;
}

model PatchFlashSaleResponse {
    @statusCode statusCode: 204;
}

model DeleteFlashSaleResponse {
    @statusCode statusCode: 204;
}
