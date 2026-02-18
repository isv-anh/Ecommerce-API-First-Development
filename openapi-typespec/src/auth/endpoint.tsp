import "@typespec/http";
import "../common/model.tsp";
import "./model.tsp";

using Common;
using Http;

@service(#{ title: "Auth API" })
namespace AuthService;

@route("/api/v1/auth")
interface Auth {
    @post
    @route("/signup")
    signup(@body signupRequest: SignupRequest): {
        @statusCode _: 201;
        @body signupResponse: SignupResponse;
    } | CommonErrors;

    @post
    @route("/signin")
    signin(@body signinRequest: SigninRequest): {
        @statusCode _: 201;
        @body signinResponse: SigninResponse;
    } | CommonErrors;
}
