import { getSwaggerPetstoreMock } from "@/generated/endpoints/petstore/petstore.msw";

export const handlers = [...getSwaggerPetstoreMock()];
