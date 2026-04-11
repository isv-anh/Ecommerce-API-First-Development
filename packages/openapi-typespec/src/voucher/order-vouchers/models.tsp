import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    orderVoucherId: "123e4567-e89b-12d3-a456-426614175600",
    orderId: "123e4567-e89b-12d3-a456-426614174B00",
    voucherId: "123e4567-e89b-12d3-a456-426614175300",
    discountAmount: 50000,
})
model OrderVoucherResponse {
    orderVoucherId: UUID;
    orderId: UUID;
    voucherId: UUID;
    discountAmount: decimal;
}

model PostOrderVoucherRequestBody {
    orderId: UUID;
    voucherId: UUID;
    discountAmount: decimal;
}

model PostOrderVoucherResponseBody {
    orderVoucherId: UUID;
}

model OrderVouchersResponse {
    orderVouchers: OrderVoucherResponse[];
}

model GetOrderVouchersResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderVouchersResponse;
}

model GetOrderVoucherByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: OrderVoucherResponse;
}

model PostOrderVoucherResponse {
    @statusCode statusCode: 201;
    @body body: PostOrderVoucherResponseBody;
}

model DeleteOrderVoucherResponse {
    @statusCode statusCode: 204;
}
