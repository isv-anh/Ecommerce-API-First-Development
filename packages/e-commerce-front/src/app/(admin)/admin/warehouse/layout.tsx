"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import {
  warehouseSearchContext,
  warehouseSearchSchema,
} from "@/features/admin/warehouse/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";

const WarehouseListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={warehouseSearchContext}
      schema={warehouseSearchSchema}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default WarehouseListLayout;
