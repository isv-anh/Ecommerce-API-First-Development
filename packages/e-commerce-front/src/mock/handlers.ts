import { getAuthAPIMock } from "@e-commerce/api-client/endpoints/auth.msw";
import { getProductAPIMock } from "@e-commerce/api-client/endpoints/product.msw";

export const handlers = [...getAuthAPIMock(), ...getProductAPIMock()];
