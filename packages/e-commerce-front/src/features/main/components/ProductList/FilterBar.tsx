"use client";

import React, { useMemo } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

interface FilterBarProps {
  brandIds: string | undefined;
  categoryIds: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: string | undefined;
  sortOrder: string | undefined;
  hasActiveFilters: boolean;
  onOpenFilterDialog: () => void;
  onApplyPrice: (min: number | undefined, max: number | undefined) => void;
  onSortChange: (sortBy: string | undefined, sortOrder: string | undefined) => void;
  onResetFilters: () => void;
}

const PRICE_OPTIONS = [
  { label: "0đ", value: 0 },
  { label: "100.000đ", value: 100000 },
  { label: "500.000đ", value: 500000 },
  { label: "1.000.000đ", value: 1000000 },
  { label: "2.000.000đ", value: 2000000 },
  { label: "5.000.000đ", value: 5000000 },
  { label: "10.000.000đ", value: 10000000 },
];

const FilterBar = ({
  brandIds,
  categoryIds,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  hasActiveFilters,
  onOpenFilterDialog,
  onApplyPrice,
  onSortChange,
  onResetFilters,
}: FilterBarProps) => {

  const handleSortSelectChange = (event: any) => {
    const value = event.target.value;
    if (value === "newest") {
      onSortChange(undefined, undefined);
    } else {
      const [by, order] = value.split("-");
      onSortChange(by, order);
    }
  };

  const getSortValue = () => {
    if (!sortBy) return "newest";
    return `${sortBy}-${sortOrder || "asc"}`;
  };

  const selectedBrandsCount = useMemo(() => {
    return brandIds ? brandIds.split(",").filter(Boolean).length : 0;
  }, [brandIds]);

  const selectedCategoriesCount = useMemo(() => {
    return categoryIds ? categoryIds.split(",").filter(Boolean).length : 0;
  }, [categoryIds]);

  const totalSelectedCount = selectedBrandsCount + selectedCategoriesCount;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        bgcolor: "background.paper",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: { xs: 2, md: 3 },
        boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.04)",
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      {/* Nút Bộ Lọc (Thương hiệu + Danh mục) */}
      <Button
        variant={totalSelectedCount > 0 ? "contained" : "outlined"}
        onClick={onOpenFilterDialog}
        startIcon={<FilterAltOutlinedIcon />}
        sx={{
          borderRadius: 8,
          textTransform: "none",
          borderColor: totalSelectedCount > 0 ? "primary.main" : "grey.300",
          color: totalSelectedCount > 0 ? "common.white" : "text.primary",
          fontWeight: 600,
          px: 3,
          py: 0.75,
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: totalSelectedCount > 0 ? "primary.dark" : "grey.50",
          },
        }}
      >
        {totalSelectedCount > 0 ? `Bộ lọc (${totalSelectedCount})` : "Bộ lọc"}
      </Button>

      <Box sx={{ width: "1px", height: 24, bgcolor: "grey.200", mx: 1, display: { xs: 'none', md: 'block' } }} />

      {/* Lọc khoảng giá */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography variant="regularS" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
          Khoảng giá:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              displayEmpty
              value={minPrice === undefined ? "" : minPrice}
              onChange={(e) => onApplyPrice(String(e.target.value) === "" ? undefined : Number(e.target.value), maxPrice)}
              sx={{ borderRadius: 2.5, bgcolor: "background.paper" }}
            >
              <MenuItem value=""><em>Từ (Không áp dụng)</em></MenuItem>
              {PRICE_OPTIONS.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  disabled={maxPrice !== undefined && option.value > maxPrice}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="regularM" color="text.secondary">-</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              displayEmpty
              value={maxPrice === undefined ? "" : maxPrice}
              onChange={(e) => onApplyPrice(minPrice, String(e.target.value) === "" ? undefined : Number(e.target.value))}
              sx={{ borderRadius: 2.5, bgcolor: "background.paper" }}
            >
              <MenuItem value=""><em>Đến (Không áp dụng)</em></MenuItem>
              {PRICE_OPTIONS.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  disabled={minPrice !== undefined && option.value < minPrice}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Bộ Sắp xếp */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="regularS" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
          Sắp xếp:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={getSortValue()}
            onChange={handleSortSelectChange}
            sx={{
              borderRadius: 2.5,
              bgcolor: "background.paper",
            }}
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
            <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
            <MenuItem value="productName-asc">Tên: A - Z</MenuItem>
            <MenuItem value="productName-desc">Tên: Z - A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Nút đặt lại bộ lọc */}
      {hasActiveFilters && (
        <Button
          variant="text"
          color="error"
          onClick={onResetFilters}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Xóa bộ lọc
        </Button>
      )}
    </Paper>
  );
};

export default FilterBar;
