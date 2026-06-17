"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateProductAttribute from "@/features/admin/product/components/ProductAttribute/CreateProductAttribute/CreateProductAttribute";
import UpdateProductAttribute from "@/features/admin/product/components/ProductAttribute/UpdateProductAttribute/UpdateProductAttribute";

import { useGetProductAttributesSuspense } from "@e-commerce/api-client/endpoints/product";
import type { ProductAttributeResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const ProductAttributeGrid = ({ productId }: { productId: string }) => {
  const { data, isFetching } = useGetProductAttributesSuspense({ productId });

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID sản phẩm", flex: 1 },
    { field: "attributeId", headerName: "ID thuộc tính", flex: 1 },
    { field: "attributeName", headerName: "Tên thuộc tính", flex: 1 },
  ];

  const rows = useMemo(() => {
    return data.productAttributes.map((pattr) => {
      return {
        id: pattr.attributeId + pattr.productId,
        ...pattr,
      };
    });
  }, [data.productAttributes]);

  const [openCreateProductAttributeForm, setOpenCreateProductAttributeForm] =
    useState(false);
  const [openUpdateProductAttributeForm, setOpenUpdateProductAttributeForm] =
    useState(false);

  const [rowSelection, setRowSelection] = useState<ProductAttributeResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateProductAttributeForm(true);
        },
        startIcon: <AddIcon />,
      },
    ];
    if (rowSelection) {
      return [
        ...buttons,
        {
          label: "Chỉnh sửa",
          action: () => {
            setOpenUpdateProductAttributeForm(true);
          },
        },
      ];
    }

    return buttons;
  }, [rowSelection]);

  return (
    <Stack
      sx={{
        height: "calc(100vh - 350px)",
        minHeight: 0,
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        slotProps={{
          toolbar: {
            leftButtons,
          },
        }}
        loading={isFetching}
        onRowClick={(params) => {
          setRowSelection((prev) =>
            prev?.attributeId === params.row.attributeId &&
            prev?.productId === params.row.productId
              ? undefined
              : params.row,
          );
        }}
        columnVisibilityModel={{
          ProductAttributeId: false,
        }}
        paginationMode="client"
        sortingMode="client"
        paginationModel={{
          page: 0,
          pageSize: 100,
        }}
      />
      <CreateProductAttribute
        productId={productId}
        open={openCreateProductAttributeForm}
        onClose={() => {
          setOpenCreateProductAttributeForm(false);
        }}
      />

      {rowSelection && (
        <UpdateProductAttribute
          open={openUpdateProductAttributeForm}
          onClose={() => {
            setOpenUpdateProductAttributeForm(false);
          }}
          id={{
            attributeId: rowSelection.attributeId,
            productId: rowSelection.productId,
          }}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default ProductAttributeGrid;
