import type {
  PatchProductBody,
  PostProductBody,
} from "@e-commerce/api-validation/types/product";

export type ProductFormType = PostProductBody | PatchProductBody;
