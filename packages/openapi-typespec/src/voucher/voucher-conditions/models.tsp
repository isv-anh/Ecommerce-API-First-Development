import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    conditionId: "123e4567-e89b-12d3-a456-426614175500",
    voucherId: "123e4567-e89b-12d3-a456-426614175300",
    type: "product",
    refId: "123e4567-e89b-12d3-a456-426614174000",
})
model VoucherConditionResponse {
    conditionId: UUID;
    voucherId: UUID;
    type: string;
    refId: UUID;
}

model PostVoucherConditionRequestBody {
    voucherId: UUID;
    type: string;
    refId: UUID;
}

model PostVoucherConditionResponseBody {
    conditionId: UUID;
}

model VoucherConditionsResponse {
    voucherConditions: VoucherConditionResponse[];
}

model GetVoucherConditionsResponse200 {
    @statusCode statusCode: 200;
    @body body: VoucherConditionsResponse;
}

model GetVoucherConditionByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: VoucherConditionResponse;
}

model PostVoucherConditionResponse {
    @statusCode statusCode: 201;
    @body body: PostVoucherConditionResponseBody;
}

model DeleteVoucherConditionResponse {
    @statusCode statusCode: 204;
}
