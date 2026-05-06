import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    voucherId: "123e4567-e89b-12d3-a456-426614175300",
    shopId: "123e4567-e89b-12d3-a456-426614175400",
    code: "SUMMER20",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 100000,
    minOrderValue: 500000,
    usageLimit: 1000,
    usedCount: 50,
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-04-30T23:59:59.000Z",
    isActive: true,
})
model VoucherResponse {
    voucherId: UUID;
    shopId: UUID;
    code: NonEmptyString;
    discountType: string;
    discountValue: decimal;
    maxDiscount?: decimal;
    minOrderValue?: decimal;
    usageLimit?: int32;
    usedCount?: int32;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

model PostVoucherRequestBody {
    shopId: UUID;
    code: NonEmptyString;
    discountType: string;
    discountValue: decimal;
    maxDiscount?: decimal;
    minOrderValue?: decimal;
    usageLimit?: int32;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

model PostVoucherResponseBody {
    voucherId: UUID;
}

model PatchVoucherRequestBody {
    code?: NonEmptyString;
    discountType?: string;
    discountValue?: decimal;
    maxDiscount?: decimal;
    minOrderValue?: decimal;
    usageLimit?: int32;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

model VouchersResponse {
    vouchers: VoucherResponse[];
}

model GetVouchersResponse200 {
    @statusCode statusCode: 200;
    @body body: VouchersResponse;
}

model GetVoucherByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: VoucherResponse;
}

model PostVoucherResponse {
    @statusCode statusCode: 201;
    @body body: PostVoucherResponseBody;
}

model PatchVoucherResponse {
    @statusCode statusCode: 204;
}

model DeleteVoucherResponse {
    @statusCode statusCode: 204;
}
