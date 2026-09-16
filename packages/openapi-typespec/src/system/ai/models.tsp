import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;

namespace System;

model ChatRequest {
  @doc("The message from the user")
  message: string;

  @doc("The optional session ID for continuity")
  sessionId?: string;
}

model ChatResponse {
  @doc("The response message from the AI")
  message: string;

  @doc("The data payload from the AI as a JSON string")
  data: string;

  @doc("The session ID used for this conversation")
  sessionId: string;
}

model Chat200Response {
  @statusCode _: 200;
  @body body: ChatResponse;
}
