"use client";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import { categorySearchContext } from "@/features/admin/category/utils";
import { useGetCategoriesSuspense } from "@e-commerce/api-client/endpoints/product/product";
import type { CategoryResponse } from "@e-commerce/api-client/schemas/product";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";

const CategoryGrid = () => {
  const { params, setParam, setParams } = categorySearchContext.useSearch();
  const { data, isFetching } = useGetCategoriesSuspense(params);

  const columns: GridColDef<CategoryResponse & { id: number }>[] = [
    { field: "categoryId", headerName: "ID" },
    { field: "categoryName", headerName: "Tên danh mục" },
    { field: "slug", headerName: "slug" },
    { field: "parentId", headerName: "ID danh mục cha" },
    { field: "parentName", headerName: "Tên danh mục cha" },
  ];

  const rows = useMemo(() => {
    return data.categories.map((category) => {
      return {
        id: category.categoryId,
        ...category,
      };
    });
  }, [data.categories]);

  return (
    <Box height={400}>
      <DataGrid
        columns={columns}
        rows={rows}
        page={params.page}
        pageSize={params.pageSize}
        paginationModelChange={(model) =>
          setParams({ page: model.page, pageSize: model.pageSize })
        }
        rowCount={data.totalCount}
        slotProps={{
          toolbar: {
            leftButtons: [
              { label: "Thêm mới", action: () => {}, startIcon: AddIcon },
            ],
          },
        }}
        loading={isFetching}
        orderBy={params.orderBy}
        orderByChange={(orderBy) => setParam("orderBy", orderBy)}
      />
    </Box>
  );
};

export default CategoryGrid;
