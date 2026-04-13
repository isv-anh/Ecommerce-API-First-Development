import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Auth API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Auth;
