import "@typespec/http";
import "@typespec/openapi";

import "./carts/routes.tsp";
import "./cart-items/routes.tsp";

@service(#{ title: "Cart API" })
namespace Cart;
