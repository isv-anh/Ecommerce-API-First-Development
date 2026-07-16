"use client";

import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import {
  useGetUserProductsSuspense,
  useGetBrandsSuspense,
} from "@e-commerce/api-client/endpoints/product";
import { userProductSearchContext } from "@/features/main/product/utils";
import Pagination from "@/components/navigation/Pagination/Pagination";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getUserProductsQueryParams } from "@e-commerce/api-validation/zod/product";
import FilterBar from "./FilterBar";
import BrandFilterDialog from "./BrandFilterDialog";

const ProductListContent = () => {
  const { params, setParams } = userProductSearchContext.useSearch();
  const { data } = useGetUserProductsSuspense(params);

  // Load danh sách thương hiệu phục vụ bộ lọc
  const { data: brandsData } = useGetBrandsSuspense({ page: 1, pageSize: 100 });

  // State Dialog chọn thương hiệu
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);

  const handleApplyPrice = (min: number | undefined, max: number | undefined) => {
    setParams({
      page: 1,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleApplyBrands = (selectedIds: string[]) => {
    setParams({
      page: 1,
      brandIds: selectedIds.length > 0 ? selectedIds.join(",") : undefined,
    });
    setBrandDialogOpen(false);
  };

  const handleResetFilters = () => {
    setParams({
      page: 1,
      productName: undefined,
      brandIds: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  };

  const handleSortChange = (sortBy: string | undefined, sortOrder: string | undefined) => {
    setParams({
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const hasActiveFilters = !!(
    params.brandIds ||
    params.minPrice ||
    params.maxPrice ||
    params.productName
  );

  return (
    <Stack spacing={3} width="100%">
      {/* Thanh Filter nằm ngang ở dưới */}
      <FilterBar
        brandIds={params.brandIds}
        minPrice={params.minPrice}
        maxPrice={params.maxPrice}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        hasActiveFilters={hasActiveFilters}
        onOpenBrandDialog={() => setBrandDialogOpen(true)}
        onApplyPrice={handleApplyPrice}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Kết quả đếm số lượng */}
      <Typography variant="regularS" color="text.secondary">
        Tìm thấy {data.totalCount} sản phẩm
      </Typography>

      {/* Grid danh sách sản phẩm chiếm trọn 12 cột */}
      {data.products.length > 0 ? (
        <Grid container spacing={2}>
          {data.products.map((product) => (
            <Grid key={product.productId} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          py={10}
          spacing={1.5}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="boldM" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="regularS" color="text.secondary">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </Typography>
        </Stack>
      )}

      <Pagination context={userProductSearchContext} totalPages={data.totalPages} />

      {/* Dialog chọn thương hiệu */}
      {brandDialogOpen && (
        <BrandFilterDialog
          open={brandDialogOpen}
          onClose={() => setBrandDialogOpen(false)}
          brandIds={params.brandIds}
          onApply={handleApplyBrands}
          brandsData={brandsData}
        />
      )}
    </Stack>
  );
};

const ProductList = () => {
  return (
    <SearchProvider
      context={userProductSearchContext}
      schema={getUserProductsQueryParams}
    >
      <ProductListContent />
    </SearchProvider>
  );
};

export default ProductList;
