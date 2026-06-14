import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetattributesQueryParams } from "@e-commerce/api-validation/types/product";

export const attributeSearchContext =
  createSearchContext<GetattributesQueryParams>();
