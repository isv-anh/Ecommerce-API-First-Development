import { handlers } from "@/mock/handlers";
import { setupWorker } from "msw/browser";

export const worker = setupWorker(...handlers);
