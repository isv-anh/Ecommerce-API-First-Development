import "@typespec/http";
import "@typespec/openapi";

import "./routes.tsp";

@service(#{ title: "Auth API" })
namespace Auth;
