import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./addresses/routes.tsp";
import "./reviews/routes.tsp";
import "./wishlists/routes.tsp";
import "./wishlist-items/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Customer API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Customer;
