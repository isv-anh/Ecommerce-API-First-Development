import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    addressId: "123e4567-e89b-12d3-a456-426614174600",
    userId: "123e4567-e89b-12d3-a456-426614174700",
    receiverName: "Nguyen Van A",
    phone: "0909123456",
    addressLine: "123 Nguyen Trai Street",
    city: "Hanoi",
    country: "Vietnam",
    isDefault: true,
})
model AddressResponse {
    addressId: UUID;
    userId: UUID;
    receiverName: NonEmptyString;
    phone: string;
    addressLine: string;
    city: NonEmptyString;
    country: NonEmptyString;
    isDefault: boolean;
}

model PostAddressRequestBody {
    userId: UUID;
    receiverName: NonEmptyString;
    phone?: string;
    addressLine?: string;
    city?: NonEmptyString;
    country?: NonEmptyString;
    isDefault?: boolean;
}

model PostAddressResponseBody {
    addressId: UUID;
}

model PatchAddressRequestBody {
    receiverName?: NonEmptyString;
    phone?: string;
    addressLine?: string;
    city?: NonEmptyString;
    country?: NonEmptyString;
    isDefault?: boolean;
}

model AddressesResponse {
    addresses: AddressResponse[];
}

model GetAddressesResponse200 {
    @statusCode statusCode: 200;
    @body body: AddressesResponse;
}

model GetAddressByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: AddressResponse;
}

model PostAddressResponse {
    @statusCode statusCode: 201;
    @body body: PostAddressResponseBody;
}

model PatchAddressResponse {
    @statusCode statusCode: 204;
}

model DeleteAddressResponse {
    @statusCode statusCode: 204;
}
