import "@typespec/http";
import "@typespec/openapi";

import "./categories/routes.tsp";
import "./products/routes.tsp";
import "./product-images/routes.tsp";
import "./product-variants/routes.tsp";
import "./product-variants-images/routes.tsp";
import "./warehouses/routes.tsp";
import "./warehouses-inventories/routes.tsp";

@service(#{ title: "Product API" })
namespace Product;
