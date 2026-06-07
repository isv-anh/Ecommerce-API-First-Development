"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import { brandSearchContext } from "@/features/admin/brand/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getBrandsQueryParams } from "@e-commerce/api-validation/zod/product";

const BrandListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider context={brandSearchContext} schema={getBrandsQueryParams}>
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default BrandListLayout;
