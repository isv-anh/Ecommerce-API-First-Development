"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateBrandForm from "@/features/admin/brand/components/CreateBrandForm/CreateBrandForm";
import UpdateBrandForm from "@/features/admin/brand/components/UpdateBrandForm/UpdateBrandForm";
import { brandSearchContext } from "@/features/admin/brand/utils";
import { useGetBrandsSuspense } from "@e-commerce/api-client/endpoints/product/product";
import type { BrandResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const BrandGrid = () => {
  const { params, setParam, setParams } = brandSearchContext.useSearch();
  const { data, isFetching } = useGetBrandsSuspense(params);

  const columns: GridColDef[] = [
    { field: "brandId", headerName: "ID", flex: 1 },
    { field: "brandName", headerName: "Tên thương hiệu", flex: 1 },
    { field: "slug", headerName: "slug", flex: 1 },
  ];

  const rows = useMemo(() => {
    return data.brands.map((brand) => {
      return {
        id: brand.brandId,
        ...brand,
      };
    });
  }, [data.brands]);

  const [openCreateBrandForm, setOpenCreateBrandForm] = useState(false);
  const [openUpdateBrandForm, setOpenUpdateBrandForm] = useState(false);

  const [rowSelection, setRowSelection] = useState<BrandResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateBrandForm(true);
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
            setOpenUpdateBrandForm(true);
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
        page={params.page}
        pageSize={params.pageSize}
        paginationModelChange={(model) =>
          setParams({ page: model.page + 1, pageSize: model.pageSize })
        }
        rowCount={data.totalCount}
        slotProps={{
          toolbar: {
            leftButtons,
          },
        }}
        loading={isFetching}
        orderBy={params.orderBy}
        orderByChange={(orderBy) => setParam("orderBy", orderBy)}
        onRowClick={(params) => {
          setRowSelection((prev) =>
            prev?.brandId === params.row.brandId ? undefined : params.row,
          );
        }}
        columnVisibilityModel={{
          brandId: false,
        }}
      />
      <CreateBrandForm
        open={openCreateBrandForm}
        onClose={() => {
          setOpenCreateBrandForm(false);
        }}
      />

      {rowSelection && (
        <UpdateBrandForm
          open={openUpdateBrandForm}
          onClose={() => {
            setOpenUpdateBrandForm(false);
          }}
          id={rowSelection.brandId}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default BrandGrid;