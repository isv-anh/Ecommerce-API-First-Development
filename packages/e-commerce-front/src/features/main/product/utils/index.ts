import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetUserProductsQueryParams } from "@e-commerce/api-validation/types/product";

export const userProductSearchContext =
  createSearchContext<GetUserProductsQueryParams>();
