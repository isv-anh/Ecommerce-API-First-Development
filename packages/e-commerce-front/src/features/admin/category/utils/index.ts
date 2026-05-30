import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetCategoriesQueryParams } from "@e-commerce/api-validation/types/product";

export const categorySearchContext =
  createSearchContext<GetCategoriesQueryParams>();
