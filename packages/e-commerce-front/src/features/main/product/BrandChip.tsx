"use client";

import { useGetBrandByBrandIdSuspense } from "@e-commerce/api-client/endpoints/product";
import Chip from "@mui/material/Chip";

interface BrandChipProps {
  brandId: string;
}

export const BrandChip = ({ brandId }: BrandChipProps) => {
  const { data: brand } = useGetBrandByBrandIdSuspense(brandId);
  return (
    <Chip
      label={brand?.brandName || "Thương hiệu"}
      color="secondary"
      size="small"
      variant="outlined"
      sx={{ alignSelf: "flex-start", fontWeight: 700, px: 1 }}
    />
  );
};
