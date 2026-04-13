import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./categories/routes.tsp";
import "./products/routes.tsp";
import "./product-images/routes.tsp";
import "./product-variants/routes.tsp";
import "./product-variants-images/routes.tsp";
import "./warehouses/routes.tsp";
import "./warehouses-inventories/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Product API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Product;
