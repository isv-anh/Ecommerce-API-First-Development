import { getAuthAPIMock } from "@e-commerce/api-client/endpoints/auth/auth.msw";

export const handlers = [...getAuthAPIMock()];
