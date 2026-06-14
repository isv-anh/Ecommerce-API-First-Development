import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./uploads/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "System API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace System;
