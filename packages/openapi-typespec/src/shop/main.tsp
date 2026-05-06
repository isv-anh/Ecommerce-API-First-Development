import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./shops/routes.tsp";
import "./commission-settings/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Shop API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Shop;
