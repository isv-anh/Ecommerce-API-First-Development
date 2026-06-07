import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "@typespec/http";

using TypeSpec.Http;

model Image {
    url: string;
}

@example(#{
    productName: "Samsung Galaxy S22 Ultra",
    description: "The latest Samsung smartphone with advanced features.",
    categoryId: "123e4567-e89b-12d3-a456-426614174000",
    slug: "samsung-galaxy-s22-ultra",
    images: #[
        #{
            url: "https://i.pinimg.com/736x/82/e7/d5/82e7d52336cff4e9d9fa9dfc7d307790.jpg",
        },
        #{
            url: "https://example.com/images/products/samsung-galaxy-s22-ultra-2.jpg",
        }
    ],
})
model PostProductRequestBody {
    productName: NonEmptyString;
    description: NonEmptyString;
    categoryId: UUID;
    brandId?: UUID | null;
    slug: Slug;
    thumbnailUrl?: string | null;

    @maxItems(10)
    images?: Image[] | null;
}

@example(#{ productId: "123e4567-e89b-12d3-a456-426614174000" })
model PostProductResponseBody {
    productId: UUID;
}

@example(#{
    productName: "Samsung Galaxy S22 Ultra",
    categoryId: "123e4567-e89b-12d3-a456-426614174000",
    slug: "samsung-galaxy-s22-ultra",
})
model PatchProductRequestBody {
    productName?: NonEmptyString | null;
    description?: NonEmptyString | null;
    categoryId?: UUID | null;
    brandId?: UUID | null;
    slug?: Slug | null;
    thumbnailUrl?: string | null;

    @maxItems(10)
    images?: Image[] | null;
}

@example(#{
    productId: "123e4567-e89b-12d3-a456-426614174001",
    productName: "Samsung Galaxy S22 Ultra",
    categoryName: "Smartphones",
    thumbnailUrl: "https://i.pinimg.com/736x/82/e7/d5/82e7d52336cff4e9d9fa9dfc7d307790.jpg",
    shopName: "Samsung Store",
    shopLogo: "https://example.com/images/shops/samsungstore.jpg",
    location: "Seoul, South Korea",
    price: 1199,
    slug: "samsung-galaxy-s22-ultra",
})
model ProductResponse {
    productId: UUID;
    productName: string;
    categoryName: string;
    thumbnailUrl: string;
    shopName: string;
    shopLogo: string;
    location: string;
    price: integer;
    slug: string;
}

@example(#{
    products: #[
        #{
            productId: "123e4567-e89b-12d3-a456-426614174000",
            productName: "iPhone 14 Pro Max",
            categoryName: "Smartphones",
            thumbnailUrl: "https://i.pinimg.com/736x/82/e7/d5/82e7d52336cff4e9d9fa9dfc7d307790.jpg",
            shopName: "Apple Store",
            shopLogo: "https://example.com/images/shops/applestore.jpg",
            location: "Cupertino, CA",
            price: 1099,
            slug: "iphone-14-pro-max",
        },
        #{
            productId: "123e4567-e89b-12d3-a456-426614174001",
            productName: "Samsung Galaxy S22 Ultra",
            categoryName: "Smartphones",
            thumbnailUrl: "https://i.pinimg.com/736x/82/e7/d5/82e7d52336cff4e9d9fa9dfc7d307790.jpg",
            shopName: "Samsung Store",
            shopLogo: "https://example.com/images/shops/samsungstore.jpg",
            location: "Seoul, South Korea",
            price: 1199,
            slug: "samsung-galaxy-s22-ultra",
        }
    ],
    totalCount: 2,
    totalPages: 1,
})
model ProductsResponse {
    ...PageResponse;
    products: ProductResponse[];
}

model GetProductRequestParams extends PageQueryParams {
    @query
    productId?: UUID;

    @query
    productName?: NonEmptyString;

    @query
    categoryId?: UUID;

    @query
    shopId?: UUID;
}

model GetProductsResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductsResponse;
}

model GetProductByProductIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductResponse;
}

model PostProductResponse {
    @statusCode statusCode: 201;
    @body body: PostProductResponseBody;
}

model PatchProductResponse {
    @statusCode statusCode: 204;
}

model DeleteProductResponse {
    @statusCode statusCode: 204;
}
