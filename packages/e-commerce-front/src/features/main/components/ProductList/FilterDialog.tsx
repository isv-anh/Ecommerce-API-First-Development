"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  brandIds: string | undefined;
  categoryIds: string | undefined;
  onApply: (selectedBrandIds: string[], selectedCategoryIds: string[]) => void;
  brandsData: { brands?: Array<{ brandId: string; brandName: string; slug: string }> } | undefined;
  categoriesData: { categories?: Array<{ categoryId: string; categoryName: string; slug: string }> } | undefined;
}

const FilterDialog = ({
  open,
  onClose,
  brandIds,
  categoryIds,
  onApply,
  brandsData,
  categoriesData,
}: FilterDialogProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const [tempSelectedBrandIds, setTempSelectedBrandIds] = useState<Set<string>>(() => {
    const selected = brandIds ? brandIds.split(",").filter(Boolean) : [];
    return new Set(selected);
  });

  const [tempSelectedCategoryIds, setTempSelectedCategoryIds] = useState<Set<string>>(() => {
    const selected = categoryIds ? categoryIds.split(",").filter(Boolean) : [];
    return new Set(selected);
  });

  const toggleBrand = (id: string) => {
    setTempSelectedBrandIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (id: string) => {
    setTempSelectedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    const brandsArray = Array.from(tempSelectedBrandIds);
    const categoriesArray = Array.from(tempSelectedCategoryIds);
    onApply(brandsArray, categoriesArray);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Bộ Lọc Sản Phẩm</DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
          <Tab label="Danh mục" sx={{ textTransform: "none", fontWeight: "bold" }} />
          <Tab label="Thương hiệu" sx={{ textTransform: "none", fontWeight: "bold" }} />
        </Tabs>
      </Box>

      <DialogContent>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="regularS" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Tích chọn một hoặc nhiều danh mục dưới đây:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2, maxHeight: 400, overflowY: "auto", alignContent: "flex-start", pb: 2 }}>
              {categoriesData?.categories?.map((category) => {
                const isSelected = tempSelectedCategoryIds.has(category.categoryId);
                return (
                  <Box
                    key={category.categoryId}
                    onClick={() => toggleCategory(category.categoryId)}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "grey.300",
                      bgcolor: isSelected ? "primary.50" : "background.paper",
                      color: isSelected ? "primary.main" : "text.primary",
                      cursor: "pointer",
                      typography: "regularS",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: isSelected ? "primary.dark" : "grey.400",
                        bgcolor: isSelected ? "primary.100" : "grey.50",
                      }
                    }}
                  >
                    {category.categoryName}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="regularS" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Tích chọn một hoặc nhiều thương hiệu dưới đây:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2, maxHeight: 400, overflowY: "auto", alignContent: "flex-start", pb: 2 }}>
              {brandsData?.brands?.map((brand) => {
                const isSelected = tempSelectedBrandIds.has(brand.brandId);
                return (
                  <Box
                    key={brand.brandId}
                    onClick={() => toggleBrand(brand.brandId)}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "grey.300",
                      bgcolor: isSelected ? "primary.50" : "background.paper",
                      color: isSelected ? "primary.main" : "text.primary",
                      cursor: "pointer",
                      typography: "regularS",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: isSelected ? "primary.dark" : "grey.400",
                        bgcolor: isSelected ? "primary.100" : "grey.50",
                      }
                    }}
                  >
                    {brand.brandName}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          sx={{
            borderRadius: 2,
            bgcolor: "text.primary",
            color: "background.paper",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "text.secondary",
            },
          }}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
