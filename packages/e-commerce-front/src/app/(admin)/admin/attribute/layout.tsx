"use client";
import type { ListPageLayoutProps } from "@/components/layouts/ListPageLayout/ListPageLayout";
import ListPageLayout from "@/components/layouts/ListPageLayout/ListPageLayout";
import { attributeSearchContext } from "@/features/admin/attribute/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getAttributesQueryParams } from "@e-commerce/api-validation/zod/product";

const AttributeListLayout = (props: ListPageLayoutProps) => {
  return (
    <SearchProvider
      context={attributeSearchContext}
      schema={getAttributesQueryParams}
    >
      <ListPageLayout {...props} />
    </SearchProvider>
  );
};

export default AttributeListLayout;
