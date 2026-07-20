"use client";

import { useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import {
  useGetBrandsSuspense,
  useGetCategoriesSuspense,
} from "@e-commerce/api-client/endpoints/product";
import { userProductSearchContext } from "@/features/main/product/utils";
import FilterBar from "./FilterBar";
import FilterDialog from "./FilterDialog";

const ProductSearchClient = () => {
  const { params, setParams } = userProductSearchContext.useSearch();

  // Load danh sách thương hiệu & danh mục phục vụ bộ lọc
  const { data: brandsData } = useGetBrandsSuspense();
  const { data: categoriesData } = useGetCategoriesSuspense();

  // State Dialog bộ lọc
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Local logic for selected brands
  const selectedBrands = useMemo(() => {
    const brandIdsArray = params.brandIds
      ? params.brandIds.split(",").filter(Boolean)
      : [];
    if (!brandsData?.brands || brandIdsArray.length === 0) return [];
    return brandsData.brands.filter((b) => brandIdsArray.includes(b.brandId));
  }, [brandsData, params.brandIds]);

  // Local logic for selected categories
  const categoryIdsParam = (params as any).categoryIds;
  const selectedCategories = useMemo(() => {
    const categoryIdsArray = categoryIdsParam
      ? categoryIdsParam.split(",").filter(Boolean)
      : [];
    if (!categoriesData?.categories || categoryIdsArray.length === 0) return [];
    return categoriesData.categories.filter((c) =>
      categoryIdsArray.includes(c.categoryId),
    );
  }, [categoriesData, categoryIdsParam]);

  const handleRemoveCategory = (categoryIdToRemove: string) => {
    const categoryIdsArray = (params as any).categoryIds
      ? (params as any).categoryIds.split(",").filter(Boolean)
      : [];
    const newCategoryIds = categoryIdsArray.filter(
      (id: string) => id !== categoryIdToRemove,
    );
    setParams({
      page: 1,
      categoryIds:
        newCategoryIds.length > 0 ? newCategoryIds.join(",") : undefined,
    } as any);
  };

  const handleRemoveBrand = (brandIdToRemove: string) => {
    const brandIdsArray = params.brandIds
      ? params.brandIds.split(",").filter(Boolean)
      : [];
    const newBrandIds = brandIdsArray.filter((id) => id !== brandIdToRemove);
    setParams({
      page: 1,
      brandIds: newBrandIds.length > 0 ? newBrandIds.join(",") : undefined,
    });
  };

  const handleApplyPrice = (
    min: number | undefined,
    max: number | undefined,
  ) => {
    setParams({
      page: 1,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleApplyFilters = (
    selectedBrandIds: string[],
    selectedCategoryIds: string[],
  ) => {
    setParams({
      page: 1,
      brandIds:
        selectedBrandIds.length > 0 ? selectedBrandIds.join(",") : undefined,
      categoryIds:
        selectedCategoryIds.length > 0
          ? selectedCategoryIds.join(",")
          : undefined,
    } as any);
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setParams({
      page: 1,
      productName: undefined,
      brandIds: undefined,
      categoryIds: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    } as any);
  };

  const handleSortChange = (
    sortBy: string | undefined,
    sortOrder: string | undefined,
  ) => {
    setParams({
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const hasActiveFilters = !!(
    params.brandIds ||
    (params as any).categoryIds ||
    params.minPrice ||
    params.maxPrice ||
    params.productName
  );

  return (
    <Stack spacing={3} width="100%">
      <FilterBar
        brandIds={params.brandIds}
        categoryIds={(params as any).categoryIds}
        minPrice={params.minPrice}
        maxPrice={params.maxPrice}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        hasActiveFilters={hasActiveFilters}
        onOpenFilterDialog={() => setFilterDialogOpen(true)}
        onApplyPrice={handleApplyPrice}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography
            variant="regularS"
            color="text.secondary"
            sx={{ mr: 0.5 }}
          >
            Bộ lọc:
          </Typography>

          {selectedCategories.map((category) => (
            <Chip
              key={category.categoryId}
              label={category.categoryName}
              onDelete={() => handleRemoveCategory(category.categoryId)}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 1.5,
                fontWeight: 600,
                bgcolor: "rgba(0,0,0,0.02)",
              }}
            />
          ))}

          {selectedBrands.map((brand) => (
            <Chip
              key={brand.brandId}
              label={brand.brandName}
              onDelete={() => handleRemoveBrand(brand.brandId)}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 1.5,
                fontWeight: 600,
                bgcolor: "rgba(0,0,0,0.02)",
              }}
            />
          ))}

          <Typography
            variant="regularS"
            color="error.main"
            sx={{
              cursor: "pointer",
              ml: 1,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleResetFilters}
          >
            Xóa tất cả
          </Typography>
        </Box>
      )}

      {filterDialogOpen && (
        <FilterDialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          brandIds={params.brandIds}
          categoryIds={(params as any).categoryIds}
          onApply={handleApplyFilters}
          brandsData={brandsData}
          categoriesData={categoriesData}
        />
      )}
    </Stack>
  );
};

export default ProductSearchClient;
