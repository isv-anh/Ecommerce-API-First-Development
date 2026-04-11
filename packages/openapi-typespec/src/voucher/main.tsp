import "@typespec/http";
import "@typespec/openapi";

import "./vouchers/routes.tsp";
import "./voucher-conditions/routes.tsp";
import "./order-vouchers/routes.tsp";
import "./flash-sales/routes.tsp";

@service(#{ title: "Voucher API" })
namespace Voucher;
