import "../../common/scalars/scalars.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    shopId: "123e4567-e89b-12d3-a456-426614175000",
    ownerId: "123e4567-e89b-12d3-a456-426614175100",
    name: "Fashion Store",
    slug: "fashion-store",
    description: "Chuyên bán thời trang nam nữ",
    logoUrl: "https://example.com/images/shops/fashion-store-logo.png",
    status: "active",
    rating: 4.8,
    totalProducts: 150,
    totalOrders: 320,
    createdAt: "2026-04-09T08:00:00.000Z",
    updatedAt: "2026-04-09T08:00:00.000Z",
})
model ShopResponse {
    shopId: UUID;
    ownerId: UUID;
    name: NonEmptyString;
    slug: NonEmptyString;
    description?: string;
    logoUrl?: string;
    status: string;
    rating: decimal;
    totalProducts: int32;
    totalOrders: int32;
    createdAt: string;
    updatedAt: string;
}

model PostShopRequestBody {
    ownerId: UUID;
    name: NonEmptyString;
    slug: NonEmptyString;
    description?: string;
    logoUrl?: string;
    status?: string;
}

model PostShopResponseBody {
    shopId: UUID;
}

model PatchShopRequestBody {
    name?: NonEmptyString;
    slug?: NonEmptyString;
    description?: string;
    logoUrl?: string;
    status?: string;
}

model ShopsResponse {
    shops: ShopResponse[];
}

model GetShopsResponse200 {
    @statusCode statusCode: 200;
    @body body: ShopsResponse;
}

model GetShopByIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ShopResponse;
}

model PostShopResponse {
    @statusCode statusCode: 201;
    @body body: PostShopResponseBody;
}

model PatchShopResponse {
    @statusCode statusCode: 204;
}

model DeleteShopResponse {
    @statusCode statusCode: 204;
}
