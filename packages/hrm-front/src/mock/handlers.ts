import { getSwaggerPetstoreMock } from "@/generated/endpoints/petstore/petstore.msw";
import { getSwaggerSystemMock } from "@/generated/endpoints/system/system.msw";

export const handlers = [
  ...getSwaggerPetstoreMock(),
  ...getSwaggerSystemMock(),
];
