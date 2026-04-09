import "@typespec/http";

using TypeSpec.Http;

model PageQueryParams {
    @minValue(1)
    @query
    page?: int32 = 1;

    @minValue(1)
    @maxValue(100)
    @query
    pageSize?: int32 = 20;

    @query
    orderBy?: string;
}
