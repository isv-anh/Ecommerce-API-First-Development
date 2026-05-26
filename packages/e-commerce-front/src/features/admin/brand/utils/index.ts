import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetBrandsQueryParams } from "@e-commerce/api-validation/types/product";

export const brandSearchContext =
  createSearchContext<GetBrandsQueryParams>();