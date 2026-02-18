import "@typespec/http";

using Http;
namespace Common;

model Error {
    message: string;
    status: int32;
}

alias ErrorResponse<Code extends int32> = {
    @statusCode _: Code;
    @body error: Error;
};

alias CommonErrors = ErrorResponse<400> | ErrorResponse<401> | ErrorResponse<500>;

model Response<T> {
    data: T;
    message: string;
}

model PaginationResponse<T> {
    page: int32;

    @minValue(10)
    @maxValue(50)
    size: int32;

    totalPage: int32;
    data: T[];
    message: string;
}
