import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "../categories/models.tsp";
import "../brands/models.tsp";
import "../product-variants/models.tsp";
import "@typespec/http";

using TypeSpec.Http;

model Image {
    url: string;
}

model PostProductRequestBody {
    productName: NonEmptyString;
    description?: NonEmptyString;
    categoryId: UUID;
    brandId?: UUID | null;
    slug: Slug;
    thumbnailUrl?: string | null;
    isPublished?: boolean | null;

    @maxItems(10)
    images?: Image[] | null;
}

model PostProductResponseBody {
    productId: UUID;
}

model PatchProductRequestBody {
    productName?: NonEmptyString | null;
    description?: string | null;
    categoryId?: UUID | null;
    brandId?: UUID | null;
    slug?: Slug | null;
    thumbnailUrl?: string | null;
    isPublished?: boolean | null;

    @maxItems(10)
    images?: Image[] | null;
}

model ProductResponse {
    productId: UUID;
    productName: string;
    categoryName: string;
    thumbnailUrl: string;
    location: string;
    price: integer;
    slug: string;
    isPublished: boolean;
}

model ProductByIdResponse {
    productId: UUID;
    productName: string;
    categoryId: UUID;
    category?: CategoryResponse;
    brandId?: UUID;
    brand?: BrandResponse;
    thumbnailUrl?: string;
    description?: string;
    slug: string;
    isPublished: boolean;
    images?: Image[];
    variants?: ProductVariantResponse[];
}

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
    categoryIds?: string;

    @query
    brandIds?: string;

    @query
    minPrice?: int32;

    @query
    maxPrice?: int32;

    @query
    sortBy?: string;

    @query
    sortOrder?: string;
}

model GetProductsResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductsResponse;
}

model GetProductByProductIdResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductByIdResponse;
}

model GetProductBySlugResponse200 {
    @statusCode statusCode: 200;
    @body body: ProductByIdResponse;
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
