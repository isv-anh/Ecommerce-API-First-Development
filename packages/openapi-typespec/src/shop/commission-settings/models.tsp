import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    commissionId: "123e4567-e89b-12d3-a456-426614175200",
    scope: "shop",
    refId: "123e4567-e89b-12d3-a456-426614175000",
    rate: 0.05,
    fixedFee: 1000,
    minFee: 500,
    maxFee: 5000,
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.000Z",
    isActive: true,
    createdAt: "2026-04-09T08:00:00.000Z",
})
model CommissionSettingResponse {
    commissionId: UUID;
    scope: string;
    refId: UUID;
    rate: decimal;
    fixedFee: decimal;
    minFee: decimal;
    maxFee: decimal;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}

model PostCommissionSettingRequestBody {
    scope: string;
    refId: UUID;
    rate: decimal;
    fixedFee?: decimal;
    minFee?: decimal;
    maxFee?: decimal;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

model PostCommissionSettingResponseBody {
    commissionId: UUID;
}

model PatchCommissionSettingRequestBody {
    scope?: string;
    refId?: UUID;
    rate?: decimal;
    fixedFee?: decimal;
    minFee?: decimal;
    maxFee?: decimal;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

model CommissionSettingsResponse {
    commissionSettings: CommissionSettingResponse[];
}

model GetCommissionSettingsResponse200 {
    @statusCode statusCode: 200;
    @body body: CommissionSettingsResponse;
}

model GetCommissionSettingByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: CommissionSettingResponse;
}

model PostCommissionSettingResponse {
    @statusCode statusCode: 201;
    @body body: PostCommissionSettingResponseBody;
}

model PatchCommissionSettingResponse {
    @statusCode statusCode: 204;
}

model DeleteCommissionSettingResponse {
    @statusCode statusCode: 204;
}
