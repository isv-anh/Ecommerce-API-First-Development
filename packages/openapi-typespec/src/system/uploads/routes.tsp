import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/uploads")
namespace System.Uploads {
    @post
    @route("/presigned-url")
    @operationId("postPresignedUrl")
    @tag("uploads")
    op postPresignedUrl(@body body: PostPresignedUrlBody):
        | PostPresignedUrl200Response
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
