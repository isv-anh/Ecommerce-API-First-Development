"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import CreateCategoryForm from "@/features/admin/category/components/CreateCategoryForm/CreateCategoryForm";
import UpdateCategoryForm from "@/features/admin/category/components/UpdateCategoryForm/UpdateCategoryForm";
import { categorySearchContext } from "@/features/admin/category/utils";
import { useGetCategoriesSuspense } from "@e-commerce/api-client/endpoints/product";
import type { CategoryResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import { type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const CategoryGrid = () => {
  const { params, setParam, setParams } = categorySearchContext.useSearch();
  const { data, isFetching } = useGetCategoriesSuspense(params);

  const columns: GridColDef[] = [
    { field: "categoryId", headerName: "ID", flex: 1 },
    { field: "categoryName", headerName: "Tên danh mục", flex: 1 },
    { field: "slug", headerName: "slug", flex: 1 },
    { field: "parentId", headerName: "ID danh mục cha", flex: 1 },
    { field: "parentName", headerName: "Tên danh mục cha", flex: 1 },
  ];

  const rows = useMemo(() => {
    return data.categories.map((category) => {
      return {
        id: category.categoryId,
        ...category,
      };
    });
  }, [data.categories]);

  const [openCreateCategoryForm, setOpenCreateCategoryForm] = useState(false);
  const [openUpdateCategoryForm, setOpenUpdateCategoryForm] = useState(false);

  const [rowSelection, setRowSelection] = useState<CategoryResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          setOpenCreateCategoryForm(true);
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
            setOpenUpdateCategoryForm(true);
          },
        },
      ];
    }

    return buttons;
  }, [rowSelection]);

  return (
    <Stack
      sx={{
        height: "calc(100vh - 400px)",
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
            prev?.categoryId === params.row.categoryId ? undefined : params.row,
          );
        }}
        columnVisibilityModel={{
          categoryId: false,
          parentId: false,
        }}
      />
      <CreateCategoryForm
        open={openCreateCategoryForm}
        onClose={() => {
          setOpenCreateCategoryForm(false);
        }}
      />

      {rowSelection && (
        <UpdateCategoryForm
          open={openUpdateCategoryForm}
          onClose={() => {
            setOpenUpdateCategoryForm(false);
          }}
          id={rowSelection.categoryId}
          setRowSelection={setRowSelection}
        />
      )}
    </Stack>
  );
};

export default CategoryGrid;
