"use client";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import { productSearchContext } from "@/features/admin/product/list/utils";
import { useGetProductsSuspense } from "@e-commerce/api-client/endpoints/product";
import type { ProductResponse } from "@e-commerce/api-client/schemas/product";
import Stack from "@mui/material/Stack";
import type { GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { routes } from "@/utils/pathMap";

const ProductGrid = () => {
  const { params, setParam, setParams } = productSearchContext.useSearch();
  const { data, isFetching } = useGetProductsSuspense(params);
  const router = useRouter();

  const columns: GridColDef<ProductResponse>[] = [
    { field: "productId", headerName: "ID", flex: 1 },
    { field: "productName", headerName: "Tên sản phẩm", flex: 1 },
    { field: "slug", headerName: "slug", flex: 1 },
    { field: "categoryName", headerName: "Danh mục", flex: 1 },
    { field: "brandName", headerName: "Thương hiệu", flex: 1 },
    {
      field: "thumbnailUrl",
      headerName: "Hình ảnh",
      flex: 1,
      renderCell: (params) => {
        return params.row.thumbnailUrl ? (
          <Image alt={params.row.productName} src={params.row.thumbnailUrl} />
        ) : (
          ""
        );
      },
    },
  ];

  const rows = useMemo(() => {
    return data.products.map((product) => {
      return {
        id: product.productId,
        ...product,
      };
    });
  }, [data.products]);

  const [rowSelection, setRowSelection] = useState<ProductResponse>();

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => {
          router.push(routes.admin.product.create);
        },
        startIcon: <AddIcon />,
      },
    ];
    if (rowSelection) {
      return [
        ...buttons,
        {
          label: "Chỉnh sửa",
          action: () => {},
        },
      ];
    }

    return buttons;
  }, [router, rowSelection]);

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
            prev?.productId === params.row.productId ? undefined : params.row,
          );
        }}
        columnVisibilityModel={{
          productId: false,
        }}
      />
    </Stack>
  );
};

export default ProductGrid;
