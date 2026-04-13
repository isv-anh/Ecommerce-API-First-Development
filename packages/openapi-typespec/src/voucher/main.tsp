import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";

import "./vouchers/routes.tsp";
import "./voucher-conditions/routes.tsp";
import "./order-vouchers/routes.tsp";
import "./flash-sales/routes.tsp";
import "../common/enums/versions.tsp";

using Versioning;
using TypeSpec.Http;

@service(#{ title: "Voucher API" })
@versioned(Versions)
@route(CurrentRouteVersion)
namespace Voucher;
