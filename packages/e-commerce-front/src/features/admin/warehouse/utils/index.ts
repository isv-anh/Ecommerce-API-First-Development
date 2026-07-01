import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import { z } from "zod";

const defaultPageSize = 20;

export const warehouseSearchSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().catch(defaultPageSize),
  orderBy: z.string().optional(),
});

export type WarehouseSearchParams = z.infer<typeof warehouseSearchSchema>;

export const warehouseSearchContext =
  createSearchContext<WarehouseSearchParams>();
