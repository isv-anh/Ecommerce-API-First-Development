"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import { orderSearchContext } from "@/features/admin/order/list/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getOrdersQueryParams } from "@e-commerce/api-validation/zod/order";

const OrderListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={orderSearchContext}
      schema={getOrdersQueryParams}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default OrderListLayout;
