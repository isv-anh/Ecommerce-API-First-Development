import { createSearchContext } from "@/providers/SearchProvider/utils/context";
import { z } from "zod";

const defaultPageSize = 20;

export const warehouseInventorySearchSchema = z.object({
  warehouseId: z.string().optional(),
  productVariantId: z.string().optional(),
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().catch(defaultPageSize),
  orderBy: z.string().optional(),
});

export type WarehouseInventorySearchParams = z.infer<
  typeof warehouseInventorySearchSchema
>;

export const warehouseInventorySearchContext =
  createSearchContext<WarehouseInventorySearchParams>();
