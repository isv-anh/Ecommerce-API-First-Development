import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    paymentId: "123e4567-e89b-12d3-a456-426614174F00",
    orderId: "123e4567-e89b-12d3-a456-426614174B00",
    method: "credit_card",
    status: "completed",
    amount: 100000,
    createdAt: "2026-04-09T08:00:00.000Z",
})
model PaymentResponse {
    paymentId: UUID;
    orderId: UUID;
    method: string;
    status: string;
    amount: decimal;
    createdAt: string;
}

model PostPaymentRequestBody {
    method: string;
    amount: decimal;
}

model PostPaymentResponseBody {
    paymentId: UUID;
}

model PatchPaymentRequestBody {
    method?: string;
    status?: string;
    amount?: decimal;
}

model PaymentsResponse {
    payments: PaymentResponse[];
}

model GetPaymentsResponse200 {
    @statusCode statusCode: 200;
    @body body: PaymentsResponse;
}

model GetPaymentByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: PaymentResponse;
}

model PostPaymentResponse {
    @statusCode statusCode: 201;
    @body body: PostPaymentResponseBody;
}

model PatchPaymentResponse {
    @statusCode statusCode: 204;
}

model DeletePaymentResponse {
    @statusCode statusCode: 204;
}
