"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import {
  warehouseInventorySearchContext,
  warehouseInventorySearchSchema,
} from "@/features/admin/warehouse-inventory/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";

const WarehouseInventoryListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={warehouseInventorySearchContext}
      schema={warehouseInventorySearchSchema}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default WarehouseInventoryListLayout;
