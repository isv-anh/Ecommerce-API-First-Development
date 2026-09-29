import "../../common/scalars/scalars.tsp";
import "../../common/models/requests.tsp";
import "../products/models.tsp";
import "@typespec/http";

using TypeSpec.Http;

model SearchProductRequestParams extends PageQueryParams {
    @query
    keyword?: string;

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
}

model SearchProductsResponse {
    ...PageResponse;
    products: ProductResponse[];
}

model SearchProductsResponse200 {
    @statusCode statusCode: 200;
    @body body: SearchProductsResponse;
}
