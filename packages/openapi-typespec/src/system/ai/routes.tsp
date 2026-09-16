import "@typespec/http";
import "@typespec/openapi";
import "../../common/models/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;

namespace System;

@tag("AI")
@route("/ai")
interface AiRoutes {
  @doc("Chat with the AI Assistant")
  @post
  @route("/chat")
  @summary("Chat with AI")
  chat(@body request: ChatRequest): Chat200Response | UnauthorizedError | BadRequestError | InternalServerError;
}

