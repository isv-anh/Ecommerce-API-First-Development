import "@typespec/http";
import "@typespec/openapi";

import "./shops/routes.tsp";
import "./commission-settings/routes.tsp";

@service(#{ title: "Shop API" })
namespace Shop;
