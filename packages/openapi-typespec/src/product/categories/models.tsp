import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "@typespec/http";

using TypeSpec.Http;

@example(#{
    categoryName: "Electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174000",
})
model PostCategoryRequestBody {
    categoryName: NonEmptyString;
    parentId?: UUID;
}

@example(#{ categoryId: "123e4567-e89b-12d3-a456-426614174000" })
model PostCategoryResponseBody {
    categoryId: UUID;
}

@example(#{
    categoryName: "Electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174000",
})
model PatchCategoryRequestBody {
    categoryName?: NonEmptyString;
    parentId?: UUID;
}

@example(#{
    categoryId: "123e4567-e89b-12d3-a456-426614174000",
    categoryName: "Electronics",
    parentId: "123e4567-e89b-12d3-a456-426614174001",
})
model CategoryResponse {
    categoryId: UUID;
    categoryName: NonEmptyString;
    parentId?: UUID;
}

@example(#{
    categories: #[
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174001",
            categoryName: "Home Appliances",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174000",
            categoryName: "Electronics",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174002",
            categoryName: "Clothing",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174003",
            categoryName: "Books",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174004",
            categoryName: "Toys",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174005",
            categoryName: "Sports",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174007",
            categoryName: "Automotive",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174006",
            categoryName: "Beauty",
            parentId: "123e4567-e89b-12d3-a456-426614174001",
        },
        #{
            categoryId: "123e4567-e89b-12d3-a456-426614174008",
            categoryName: "Garden",
        }
    ],
})
model CategoriesResponse {
    categories: CategoryResponse[];
}

model GetCategoryRequestParams extends PageQueryParams {
    @query
    categoryId?: UUID;

    @query
    categoryName?: NonEmptyString;
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
