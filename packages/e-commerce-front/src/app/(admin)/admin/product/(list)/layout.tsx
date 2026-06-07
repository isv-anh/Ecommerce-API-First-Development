"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import { productSearchContext } from "@/features/admin/product/list/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getProductsQueryParams } from "@e-commerce/api-validation/zod/product";

const ProductListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={productSearchContext}
      schema={getProductsQueryParams}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default ProductListLayout;
