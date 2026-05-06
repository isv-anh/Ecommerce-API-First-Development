import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/customers/reviews")
namespace Customer.Reviews {
    @get
    @route("")
    @operationId("getReviews")
    @tag("customer-reviews")
    op getReviews(
        @query userId?: UUID,
        @query productId?: UUID,
    ): GetReviewsResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postReview")
    @tag("customer-reviews")
    op postReview(@body body: PostReviewRequestBody):
        | PostReviewResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{reviewId}")
    @operationId("getReviewById")
    @tag("customer-reviews")
    op getReviewById(
        @path reviewId: UUID,
    ): GetReviewByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{reviewId}")
    @operationId("patchReview")
    @tag("customer-reviews")
    op patchReview(@path reviewId: UUID, @body body: PatchReviewRequestBody):
        | PatchReviewResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{reviewId}")
    @operationId("deleteReview")
    @tag("customer-reviews")
    op deleteReview(@path reviewId: UUID):
        | DeleteReviewResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
