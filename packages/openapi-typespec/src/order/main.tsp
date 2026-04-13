import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./orders/routes.tsp";
import "./order-items/routes.tsp";
import "./order-shops/routes.tsp";
import "./payments/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Order API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Order;
