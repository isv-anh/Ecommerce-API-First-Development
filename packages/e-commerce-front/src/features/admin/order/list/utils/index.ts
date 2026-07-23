import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetOrdersQueryParams } from "@e-commerce/api-validation/types/order";

export const orderSearchContext =
  createSearchContext<GetOrdersQueryParams>();

