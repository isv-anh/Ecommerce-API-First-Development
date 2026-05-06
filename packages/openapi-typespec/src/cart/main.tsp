import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./carts/routes.tsp";
import "./cart-items/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Cart API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Cart;
