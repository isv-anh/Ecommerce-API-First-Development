import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetProductsQueryParams } from "@e-commerce/api-validation/types/product";

export const productSearchContext =
  createSearchContext<GetProductsQueryParams>();
