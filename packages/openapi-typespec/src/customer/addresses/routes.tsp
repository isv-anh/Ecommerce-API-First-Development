import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/customers/addresses")
namespace Customer.Addresses {
    @get
    @route("")
    @operationId("getAddresses")
    @tag("customer-addresses")
    op getAddresses(
        @query userId?: UUID,
    ): GetAddressesResponse200 | BadRequestError | InternalServerError;

    @post
    @route("")
    @operationId("postAddress")
    @tag("customer-addresses")
    op postAddress(@body body: PostAddressRequestBody):
        | PostAddressResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @get
    @route("/{addressId}")
    @operationId("getAddressById")
    @tag("customer-addresses")
    op getAddressById(
        @path addressId: UUID,
    ): GetAddressByIdResponse200 | BadRequestError | InternalServerError;

    @patch
    @route("/{addressId}")
    @operationId("patchAddress")
    @tag("customer-addresses")
    op patchAddress(
        @path addressId: UUID,
        @body body: PatchAddressRequestBody,
    ):
        | PatchAddressResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @delete
    @route("/{addressId}")
    @operationId("deleteAddress")
    @tag("customer-addresses")
    op deleteAddress(@path addressId: UUID):
        | DeleteAddressResponse
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;
}
