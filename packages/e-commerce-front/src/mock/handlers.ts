import { getSwaggerPetstoreMock } from "@e-commerce/api-client/endpoints/petstore/petstore.msw";
import { getSwaggerSystemMock } from "@e-commerce/api-client/endpoints/system/system.msw";

export const handlers = [
  ...getSwaggerPetstoreMock(),
  ...getSwaggerSystemMock(),
];
