import "@typespec/http";
import "@typespec/openapi";

import "./addresses/routes.tsp";
import "./reviews/routes.tsp";
import "./wishlists/routes.tsp";
import "./wishlist-items/routes.tsp";

@service(#{ title: "Customer API" })
namespace Customer;
