"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import { categorySearchContext } from "@/features/admin/category/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getCategoriesQueryParams } from "@e-commerce/api-validation/zod/product";

const CategoryListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={categorySearchContext}
      schema={getCategoriesQueryParams}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default CategoryListLayout;
