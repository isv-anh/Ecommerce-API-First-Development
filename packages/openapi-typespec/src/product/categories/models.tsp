import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "../../common/models/response.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    categoryName: "Electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174000",
    slug: "electronics",
})
model PostCategoryRequestBody {
    categoryName: NonEmptyString;
    parentId?: UUID;
    slug: NonEmptyString;
}

@example(#{ categoryId: "123e4567-e89b-12d3-a456-426614174000" })
model PostCategoryResponseBody {
    categoryId: UUID;
}

@example(#{
    categoryName: "Electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174000",
    slug: "electronics",
})
model PatchCategoryRequestBody {
    categoryName?: NonEmptyString;
    parentId?: UUID;
    slug?: NonEmptyString;
}

@example(#{
    categoryId: "123e4567-e89b-12d3-a456-426614174000",
    categoryName: "Electronics",
    slug: "electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174001",
})
model CategoryResponse {
    categoryId: UUID;
    categoryName: NonEmptyString;
    slug: NonEmptyString;
    parentId?: UUID;
}

@example(#{
    categories: #[
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174001",
            categoryName: "Home Appliances",
            slug: "home-appliances",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174000",
            categoryName: "Electronics",
            slug: "electronics",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174002",
            categoryName: "Clothing",
            slug: "clothing",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174003",
            categoryName: "Books",
            slug: "books",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174004",
            categoryName: "Toys",
            slug: "toys",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174005",
            categoryName: "Sports",
            slug: "sports",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174007",
            categoryName: "Automotive",
            slug: "automotive",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174006",
            categoryName: "Beauty",
            slug: "beauty",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174008",
            categoryName: "Garden",
            slug: "garden",
        }
    ],
    totalCount: 9,
    totalPages: 1,
})
model CategoriesResponse {
    ...PageResponse;
    categories: CategoryResponse[];
}

model GetCategoryRequestParams extends PageQueryParams {
    @query
    categoryId?: UUID;

    @query
    categoryName?: NonEmptyString;

    @query
    parentId?: UUID;

    @query
    slug?: NonEmptyString;
}

model GetCategoriesResponse200 {
    @statusCode statusCode: 200;
    @body body: CategoriesResponse;
}

model GetCategoryByCategoryIdResponse200 {
    @statusCode statusCode: 200;
    @body body: CategoryResponse;
}

model PostCategoryResponse {
    @statusCode statusCode: 201;
    @body body: PostCategoryResponseBody;
}

model PatchCategoryResponse {
    @statusCode statusCode: 204;
}

model DeleteCategoryResponse {
    @statusCode statusCode: 204;
}
