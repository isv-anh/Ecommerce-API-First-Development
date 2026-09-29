import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { SearchProductsQueryParams } from "@e-commerce/api-validation/types/product";

export const userProductSearchContext =
  createSearchContext<SearchProductsQueryParams>();
