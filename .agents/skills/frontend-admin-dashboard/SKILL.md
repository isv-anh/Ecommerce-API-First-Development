---
name: frontend-admin-dashboard
description: Hướng dẫn phát triển các trang quản trị (Admin Dashboard) trong Next.js App Router, sử dụng Orval API hooks, DataGrid và quản lý bộ lọc tìm kiếm.
---

## 1. Tổng quan (Overview)

Tài liệu này hướng dẫn các lập trình viên và AI Agent xây dựng các giao diện quản trị (Admin Dashboard) cho phía Frontend nằm trong package `packages/e-commerce-front`. Hệ thống sử dụng kiến trúc **Next.js App Router** kết hợp với **Material UI (MUI)** và các hook gọi API được sinh tự động bởi **Orval** từ OpenAPI.

---

## 2. Cấu trúc thư mục các trang Admin

Kiến trúc phân tách rõ ràng giữa **Định tuyến (Routing)** và **Giao diện/Logic nghiệp vụ (Features)**:

### 2.1. Thư mục Định tuyến (`src/app/(admin)/admin`)

Các file nằm ở đây chỉ đóng vai trò cấu trúc đường dẫn URL và là điểm vào (entry points) cực kỳ gọn nhẹ.

- **Trang danh sách (List Page)**: Được thiết kế dưới dạng **Parallel Routes** kết hợp với **Route Groups** để tách biệt phần bảng dữ liệu (`@content`) và phần bộ lọc (`@search`).
  _Cấu trúc thư mục:_
  ```text
  src/app/(admin)/admin/product/(list)/
  ├── @content/
  │   └── page.tsx        # Render Grid hiển thị dữ liệu
  ├── @search/
  │   └── page.tsx        # Render biểu mẫu tìm kiếm/lọc
  └── layout.tsx          # Cấu hình SearchProvider bọc toàn bộ trang
  ```
- **Trang chi tiết / Tạo mới (Detail/Create Page)**:
  _Cấu trúc thư mục:_
  ```text
  src/app/(admin)/admin/product/(detail)/
  ├── [productId]/
  │   └── page.tsx        # Trang chỉnh sửa/xem chi tiết sản phẩm (nhận params.productId)
  └── new/
      └── page.tsx        # Trang tạo mới sản phẩm
  ```

### 2.2. Thư mục Component & Logic nghiệp vụ (`src/features/admin`)

Đây là nơi chứa toàn bộ code xử lý logic, biểu mẫu, bảng dữ liệu (DataGrid) của từng chức năng:

```text
src/features/admin/product/
├── components/          # Các component dùng chung cho cả tạo/sửa
│   └── ProductForm/     # Component chứa các trường nhập của sản phẩm
├── detail/
│   └── ProductDetail.tsx# Xử lý logic và API sửa/xóa sản phẩm
├── list/
│   ├── components/
│   │   ├── ProductGrid/ # Component DataGrid hiển thị danh sách sản phẩm
│   │   └── ProductSearch/# Component chứa bộ lọc tìm kiếm
│   └── utils/
│       └── index.ts     # Khởi tạo SearchContext cho trang danh sách
└── new/
    └── ProductNew.tsx   # Xử lý logic và API tạo sản phẩm mới
```

---

## 3. Các quy tắc phát triển cốt lõi

### 3.1. Sử dụng API Hooks sinh bởi Orval

- ⚠️ **Tuyệt đối không sử dụng `fetch` hoặc `axios` trực tiếp** trong các component.
- Mọi thao tác truy vấn dữ liệu phải sử dụng các React Query hooks được sinh trong `@e-commerce/api-client/endpoints/[feature]`.
- Ưu tiên sử dụng phiên bản **Suspense** của query (ví dụ: `useGetProductsSuspense(params)`) kết hợp với `<SuspenseWrapper>` để xử lý trạng thái Loading tự động.

### 3.2. Quản lý bộ lọc tìm kiếm với `SearchProvider`

Mỗi trang danh sách cần duy trì trạng thái tìm kiếm (pagination, filter, sorting). Dự án cung cấp một giải pháp đồng bộ qua `SearchProvider`:

1. Tạo search context tại `features/admin/[feature]/list/utils/index.ts`:

   ```ts
   import { createSearchContext } from "@/providers/SearchProvider/utils/context";
   import type { GetProductsQueryParams } from "@e-commerce/api-validation/types/product";

   export const productSearchContext =
     createSearchContext<GetProductsQueryParams>();
   ```

2. Bao bọc trang bằng `SearchProvider` trong `layout.tsx` của trang danh sách:

   ```tsx
   import SearchProvider from "@/providers/SearchProvider/SearchProvider";
   import { getProductsQueryParams } from "@e-commerce/api-validation/zod/product";
   import { productSearchContext } from "@/features/admin/product/list/utils";

   const ProductListLayout = (props: ListPageLayoutProps) => {
     return (
       <SearchProvider
         context={productSearchContext}
         schema={getProductsQueryParams}
       >
         <ListPageLayout {...props} />
       </SearchProvider>
     );
   };
   ```

3. Sử dụng dữ liệu tìm kiếm trong các subcomponent:
   ```ts
   const { params, setParam, setParams } = productSearchContext.useSearch();
   const { data, isFetching } = useGetProductsSuspense(params);
   ```

### 3.3. Xây dựng biểu mẫu với React Hook Form & Zod

- Sử dụng `react-hook-form` để quản lý trạng thái form.
- Liên kết với Zod validation schemas bằng `@hookform/resolvers/zod`. Các schema phải được import từ thư viện validation sinh sẵn `@e-commerce/api-validation/zod/[feature]`.
- Sử dụng `<FormProvider>` để truyền form methods xuống các subcomponents một cách dễ dàng.

### 3.4. Quản lý các nút hành động với `useFabs`

Floating Action Buttons (Fabs) là khu vực hiển thị các nút thao tác chung (Nút Quay lại, nút Lưu).

- Sử dụng hook `useFabs()` trong trang chi tiết để đăng ký các nút này vào khung Layout của Admin.
- Phải đảm bảo gọi `clear()` khi unmount component tránh rò rỉ nút sang trang khác.

---

## 4. Ví dụ code tham chiếu (Reference Code)

### 4.1. Component DataGrid hiển thị danh sách (`ProductGrid.tsx`)

```tsx
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
import { useRouter } from "next/navigation";
import { routes } from "@/utils/pathMap";
import Chip from "@mui/material/Chip";

const ProductGrid = () => {
  const { params, setParam, setParams } = productSearchContext.useSearch();
  const { data, isFetching } = useGetProductsSuspense(params);
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<ProductResponse>();

  const columns: GridColDef<ProductResponse>[] = [
    { field: "productId", headerName: "ID", flex: 1 },
    { field: "productName", headerName: "Tên sản phẩm", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
    {
      field: "isPublished",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Đã xuất bản" color="success" size="small" />
        ) : (
          <Chip label="Bản nháp" color="default" size="small" />
        ),
    },
  ];

  const rows = useMemo(() => {
    return data.products.map((product) => ({
      id: product.productId,
      ...product,
    }));
  }, [data.products]);

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [
      {
        label: "Thêm mới",
        action: () => router.push(routes.admin.product.create),
        startIcon: <AddIcon />,
      },
    ];
    if (rowSelection) {
      buttons.push({
        label: "Chỉnh sửa",
        action: () =>
          router.push(routes.admin.product.detail(rowSelection.productId)),
      });
    }
    return buttons;
  }, [router, rowSelection]);

  return (
    <Stack sx={{ height: "calc(100vh - 350px)", minHeight: 0 }}>
      <DataGrid
        columns={columns}
        rows={rows}
        page={params.page}
        pageSize={params.pageSize}
        paginationModelChange={(model) =>
          setParams({ page: model.page + 1, pageSize: model.pageSize })
        }
        rowCount={data.totalCount}
        slotProps={{ toolbar: { leftButtons } }}
        loading={isFetching}
        orderBy={params.orderBy}
        orderByChange={(orderBy) => setParam("orderBy", orderBy)}
        onRowClick={(params) => {
          setRowSelection((prev) =>
            prev?.productId === params.row.productId ? undefined : params.row,
          );
        }}
        columnVisibilityModel={{ productId: false }}
      />
    </Stack>
  );
};

export default ProductGrid;
```

### 4.2. Component Chi tiết & Sửa xóa dữ liệu (`ProductDetail.tsx`)

```tsx
"use client";
import useFabs from "@/components/inputs/Fabs/provider/hooks/useFabs";
import ProductForm from "@/features/admin/product/components/ProductForm/ProductForm";
import { routes } from "@/utils/pathMap";
import {
  getGetProductsQueryKey,
  useDeleteProduct,
  useGetProductByProductIdSuspense,
  usePatchProduct,
} from "@e-commerce/api-client/endpoints/product";
import type { PatchProductBody } from "@e-commerce/api-validation/types/product";
import { patchProductBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";

const ProductDetail = ({ productId }: { productId: string }) => {
  const methods = useForm<PatchProductBody>({
    resolver: zodResolver(patchProductBody),
    defaultValues: { images: [], isPublished: false },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const patchProduct = usePatchProduct();
  const queryProductById = useGetProductByProductIdSuspense(productId);
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const { setFabs, clear } = useFabs();
  const router = useRouter();
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const { reset } = methods;

  useEffect(() => {
    reset(queryProductById.data);
  }, [queryProductById.data, reset]);

  const onSubmit = useCallback(
    async (data: PatchProductBody) => {
      try {
        await patchProduct.mutateAsync({ productId, data });
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        enqueueSnackbar({
          message: "Cập nhật sản phẩm thành công",
          variant: "success",
        });
        router.push(routes.admin.product.list);
      } catch (error) {
        enqueueSnackbar({
          message: (error as Error).message,
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, patchProduct, productId, queryClient, router],
  );

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      await deleteProduct.mutateAsync({ productId });
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      enqueueSnackbar({ message: "Sản phẩm đã được xóa", variant: "success" });
      router.push(routes.admin.product.list);
    } catch (error) {
      enqueueSnackbar({ message: (error as Error).message, variant: "error" });
    }
  };

  useEffect(() => {
    setFabs([
      { type: "back", href: routes.admin.product.list },
      {
        type: "button",
        label: "Cập nhật",
        onClick: () => submitRef.current?.click(),
      },
    ]);
    return () => {
      clear();
    };
  }, [clear, setFabs]);

  return (
    <FormProvider {...methods}>
      <Paper
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        sx={{ p: 3, minHeight: "calc(100vh - 145px)" }}
      >
        <Stack spacing={2}>
          <ProductForm />
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmOpen(true)}
            sx={{ width: "fit-content" }}
          >
            Xóa
          </Button>
        </Stack>
        <Button type="submit" ref={submitRef} sx={{ display: "none" }}></Button>
        <Backdrop open={patchProduct.isPending || deleteProduct.isPending}>
          <CircularProgress />
        </Backdrop>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        confirmButtonColor="error"
        confirmButtonVariant="contained"
        confirmButtonTitle="Xóa"
      />
    </FormProvider>
  );
};

export default ProductDetail;
```

---

## 5. Danh sách kiểm tra khi hoàn thành trang (Checklist)

- [ ] Trang đã sử dụng đúng liên kết định tuyến từ `routes` trong `@/utils/pathMap.ts`.
- [ ] Bảng dữ liệu DataGrid đã tích hợp đầy đủ phân trang (`page`, `pageSize`) và sắp xếp (`orderBy`) thông qua `SearchProvider`.
- [ ] Các API call sử dụng đúng hook được sinh bởi Orval từ thư viện `@e-commerce/api-client`.
- [ ] Toàn bộ biểu mẫu đã liên kết và kiểm tra tính hợp lệ bằng schema Zod (resolver) tương ứng.
- [ ] Đã đăng ký/làm sạch các Fabs button bằng hook `useFabs`.
