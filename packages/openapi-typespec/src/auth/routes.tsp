import "@typespec/http";
import "@typespec/openapi";
import "./models.tsp";
import "../common/models/errors.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/auth")
namespace Auth.Auth {
    @post
    @route("/login")
    @operationId("postLogin")
    @tag("auth")
    @extension("x-public", true)
    op login(@body body: LoginRequest):
        | AuthResponse200
        | UnauthorizedError
        | BadRequestError
        | InternalServerError;

    @post
    @route("/register")
    @operationId("postRegister")
    @tag("auth")
    @extension("x-public", true)
    op register(
        @body body: RegisterRequest,
    ): AuthResponse200 | BadRequestError | InternalServerError;

    @post
    @route("/refresh")
    @operationId("postRefreshToken")
    @tag("auth")
    @extension("x-public", true)
    op refresh(
        @body body: RefreshTokenRequest,
    ): AuthResponse200 | BadRequestError | InternalServerError;

    @get
    @route("/profile")
    @operationId("getProfile")
    @tag("auth")
    op getProfile(
        @header authorization: string,
    ): UserProfile200 | UnauthorizedError | InternalServerError;
}
