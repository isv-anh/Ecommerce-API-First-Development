import "@typespec/http";
import "@typespec/openapi";

import "./orders/routes.tsp";
import "./order-items/routes.tsp";
import "./order-shops/routes.tsp";
import "./payments/routes.tsp";

@service(#{ title: "Order API" })
namespace Order;
