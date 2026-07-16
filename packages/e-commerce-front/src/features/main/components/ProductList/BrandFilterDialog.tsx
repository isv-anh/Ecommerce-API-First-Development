"use client";

import React, { useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

interface BrandFilterDialogProps {
  open: boolean;
  onClose: () => void;
  brandIds: string | undefined;
  onApply: (selectedIds: string[]) => void;
  brandsData: { brands?: Array<{ brandId: string; brandName: string; slug: string }> } | undefined;
}

const BrandFilterDialog = ({
  open,
  onClose,
  brandIds,
  onApply,
  brandsData,
}: BrandFilterDialogProps) => {
  const [tempSelectedBrandIds, setTempSelectedBrandIds] = useState<GridRowSelectionModel>(() => {
    const selected = brandIds ? brandIds.split(",").filter(Boolean) : [];
    return {
      type: "include",
      ids: new Set(selected),
    };
  });

  const brandColumns: GridColDef[] = [
    { field: "brandName", headerName: "Tên thương hiệu", flex: 1, sortable: true },
    { field: "slug", headerName: "Slug", flex: 1, sortable: true },
  ];

  const brandRows = useMemo(() => {
    return brandsData?.brands?.map((brand) => ({
      id: brand.brandId,
      ...brand,
    })) || [];
  }, [brandsData?.brands]);

  const handleApply = () => {
    const idsArray = Array.from(tempSelectedBrandIds.ids || []).map(String);
    onApply(idsArray);
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
      <DialogTitle sx={{ fontWeight: "bold" }}>Chọn Thương Hiệu</DialogTitle>
      <DialogContent>
        <Typography variant="regularS" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Tích chọn một hoặc nhiều thương hiệu dưới đây:
        </Typography>
        <Box sx={{ height: 400, width: "100%", mt: 1 }}>
          <DataGrid
            rows={brandRows}
            columns={brandColumns}
            checkboxSelection
            rowSelectionModel={tempSelectedBrandIds}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setTempSelectedBrandIds(newRowSelectionModel);
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            localeText={{
              noRowsLabel: "Không có thương hiệu nào",
              footerRowSelected: (count) => `Đã chọn ${count} thương hiệu`,
            }}
            sx={{
              borderRadius: 3,
              borderColor: "divider",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
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

export default BrandFilterDialog;
