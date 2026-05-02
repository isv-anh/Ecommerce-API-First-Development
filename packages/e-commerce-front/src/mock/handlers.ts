import { getAuthAPIMock } from "@e-commerce/api-client/endpoints/auth/auth.msw";
import { getProductAPIMock } from "@e-commerce/api-client/endpoints/product/product.msw";

export const handlers = [...getAuthAPIMock(), ...getProductAPIMock()];
