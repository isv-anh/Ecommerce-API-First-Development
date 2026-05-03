import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "../../common/models/response.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{ brandName: "Apple", slug: "apple" })
model PostBrandRequestBody {
    brandName: NonEmptyString;
    slug: NonEmptyString;
}

@example(#{ brandId: "123e4567-e89b-12d3-a456-426614174000" })
model PostBrandResponseBody {
    brandId: UUID;
}

@example(#{ brandName: "Apple", slug: "apple" })
model PatchBrandRequestBody {
    brandName?: NonEmptyString;
    slug?: NonEmptyString;
}

@example(#{
    brandId: "123e4567-e89b-12d3-a456-426614174000",
    brandName: "Apple",
    slug: "apple",
})
model BrandResponse {
    brandId: UUID;
    brandName: NonEmptyString;
    slug: NonEmptyString;
}

@example(#{
    brands: #[
        #{
            brandId: "123e4567-e89b-12d3-a456-426614174001",
            brandName: "Apple",
            slug: "apple",
        },
        #{
            brandId: "123e4567-e89b-12d3-a456-426614174002",
            brandName: "Samsung",
            slug: "samsung",
        }
    ],
    totalCount: 2,
    totalPages: 1,
})
model GetBrandsResponse {
    ...PageResponse;
    brands: BrandResponse[];
}

model GetBrandRequestParams extends PageQueryParams {
    @query
    brandName?: NonEmptyString;

    @query
    slug?: NonEmptyString;
}

model GetBrandsResponse200 {
    @statusCode statusCode: 200;
    @body body: GetBrandsResponse;
}

model GetBrandByBrandIdResponse200 {
    @statusCode statusCode: 200;
    @body body: BrandResponse;
}

model PostBrandResponse {
    @statusCode statusCode: 201;
    @body body: PostBrandResponseBody;
}

model PatchBrandResponse {
    @statusCode statusCode: 204;
}

model DeleteBrandResponse {
    @statusCode statusCode: 204;
}
