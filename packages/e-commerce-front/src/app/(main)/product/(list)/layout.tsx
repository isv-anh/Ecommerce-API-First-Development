"use client";
import React, { Suspense } from "react";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { userProductSearchContext } from "@/features/main/product/utils";
import { getUserProductsQueryParams } from "@e-commerce/api-validation/zod/product";

interface ProductLayoutProps {
  search: React.ReactNode;
  products: React.ReactNode;
}

export default function ProductLayout({
  search,
  products,
}: ProductLayoutProps) {
  return (
    <Suspense fallback={null}>
      <SearchProvider
        context={userProductSearchContext}
        schema={getUserProductsQueryParams}
      >
        <div className="w-full flex flex-col gap-6 py-8">
          {search}
          {products}
        </div>
      </SearchProvider>
    </Suspense>
  );
}
