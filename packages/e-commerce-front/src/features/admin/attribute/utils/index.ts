import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import type { GetAttributesQueryParams } from "@e-commerce/api-validation/types/product";

export const attributeSearchContext =
  createSearchContext<GetAttributesQueryParams>();
