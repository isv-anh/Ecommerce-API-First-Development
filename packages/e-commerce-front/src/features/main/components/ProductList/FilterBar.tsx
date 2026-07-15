"use client";

import React, { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface FilterBarProps {
  brandIds: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: string | undefined;
  sortOrder: string | undefined;
  hasActiveFilters: boolean;
  onOpenBrandDialog: () => void;
  onApplyPrice: (min: number | undefined, max: number | undefined) => void;
  onSortChange: (sortBy: string | undefined, sortOrder: string | undefined) => void;
  onResetFilters: () => void;
}

const FilterBar = ({
  brandIds,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  hasActiveFilters,
  onOpenBrandDialog,
  onApplyPrice,
  onSortChange,
  onResetFilters,
}: FilterBarProps) => {
  // Local state cho khoảng giá
  const [localMinPrice, setLocalMinPrice] = useState<string>(
    minPrice ? String(minPrice) : ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    maxPrice ? String(maxPrice) : ""
  );

  const [prevMinPrice, setPrevMinPrice] = useState(minPrice);
  const [prevMaxPrice, setPrevMaxPrice] = useState(maxPrice);

  if (minPrice !== prevMinPrice) {
    setPrevMinPrice(minPrice);
    setLocalMinPrice(minPrice ? String(minPrice) : "");
  }

  if (maxPrice !== prevMaxPrice) {
    setPrevMaxPrice(maxPrice);
    setLocalMaxPrice(maxPrice ? String(maxPrice) : "");
  }

  const handleApplyPriceClick = () => {
    const min = localMinPrice ? parseInt(localMinPrice, 10) : undefined;
    const max = localMaxPrice ? parseInt(localMaxPrice, 10) : undefined;
    onApplyPrice(min, max);
  };

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

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.01)",
      }}
    >
      {/* Bộ lọc Thương hiệu */}
      <Button
        variant="outlined"
        onClick={onOpenBrandDialog}
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          borderColor: selectedBrandsCount > 0 ? "primary.main" : "divider",
          color: selectedBrandsCount > 0 ? "primary.main" : "text.secondary",
          fontWeight: selectedBrandsCount > 0 ? "bold" : "regular",
          px: 2,
          py: 0.75,
          "&:hover": {
            borderColor: selectedBrandsCount > 0 ? "primary.dark" : "text.primary",
            bgcolor: "action.hover",
          },
        }}
      >
        {selectedBrandsCount > 0 ? `Thương hiệu (${selectedBrandsCount})` : "Chọn thương hiệu"}
      </Button>

      {/* Lọc khoảng giá */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          placeholder="Giá từ đ"
          size="small"
          type="number"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          slotProps={{
            htmlInput: { min: 0 },
          }}
          sx={{
            width: 150,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
            },
          }}
        />
        <Typography variant="regularS" color="text.secondary">
          -
        </Typography>
        <TextField
          placeholder="Đến đ"
          size="small"
          type="number"
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          slotProps={{
            htmlInput: { min: 0 },
          }}
          sx={{
            width: 150,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleApplyPriceClick}
          sx={{
            borderRadius: 2.5,
            bgcolor: "primary.main",
            color: "common.white",
            textTransform: "none",
            fontWeight: "bold",
            py: 0.75,
            px: 2,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Áp dụng giá
        </Button>
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
