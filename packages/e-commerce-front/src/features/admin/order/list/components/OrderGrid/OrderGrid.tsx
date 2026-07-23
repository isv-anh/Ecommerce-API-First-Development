"use client";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";
import type { ToolbarButton } from "@/components/data-display/DataGrid/components/Toolbar/types";
import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import { orderSearchContext } from "@/features/admin/order/list/utils";
import { routes } from "@/utils/pathMap";
import {
  getGetOrdersQueryKey,
  useDeleteOrder,
  useGetOrdersSuspense,
} from "@e-commerce/api-client/endpoints/order";
import type { OrderResponse } from "@e-commerce/api-client/schemas/order";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import type { GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

const formatVND = (value: number | undefined) => {
  if (value === undefined || value === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const getStatusChip = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return <Chip label="Chờ xử lý" color="warning" size="small" />;
    case "confirmed":
      return <Chip label="Đã xác nhận" color="info" size="small" />;
    case "shipping":
      return <Chip label="Đang giao hàng" color="primary" size="small" />;
    case "completed":
      return <Chip label="Hoàn thành" color="success" size="small" />;
    case "cancelled":
      return <Chip label="Đã hủy" color="error" size="small" />;
    default:
      return (
        <Chip label={status || "Không xác định"} color="default" size="small" />
      );
  }
};

const OrderGrid = () => {
  const { params, setParam, setParams } = orderSearchContext.useSearch();
  const { data, isFetching } = useGetOrdersSuspense(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const deleteOrder = useDeleteOrder();

  const [rowSelection, setRowSelection] = useState<OrderResponse>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: GridColDef<OrderResponse>[] = [
    { field: "orderId", headerName: "Mã đơn hàng", flex: 1.5, minWidth: 220 },
    { field: "userId", headerName: "Mã khách hàng", flex: 1.5, minWidth: 220 },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value) => formatVND(value),
    },
    {
      field: "totalDiscount",
      headerName: "Giảm giá",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value) => formatVND(value),
    },
    {
      field: "finalAmount",
      headerName: "Thành tiền",
      flex: 1,
      minWidth: 130,
      valueFormatter: (value) => formatVND(value),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 160,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString("vi-VN") : "",
    },
  ];

  const rows = useMemo(() => {
    return (data.orders || []).map((order) => ({
      id: order.orderId,
      ...order,
    }));
  }, [data.orders]);

  const handleDelete = async () => {
    if (!rowSelection) return;
    setConfirmOpen(false);
    try {
      await deleteOrder.mutateAsync({ orderId: rowSelection.orderId });
      queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
      enqueueSnackbar({
        message: "Xóa đơn hàng thành công",
        variant: "success",
      });
      setRowSelection(undefined);
    } catch (error) {
      enqueueSnackbar({
        message: (error as Error).message || "Không thể xóa đơn hàng",
        variant: "error",
      });
    }
  };

  const leftButtons = useMemo(() => {
    const buttons: ToolbarButton[] = [];
    if (rowSelection) {
      buttons.push({
        label: "Xem chi tiết",
        action: () =>
          router.push(routes.admin.order.detail(rowSelection.orderId)),
        startIcon: <VisibilityIcon />,
      });
      buttons.push({
        label: "Xóa",
        action: () => setConfirmOpen(true),
        startIcon: <DeleteIcon />,
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
            prev?.orderId === params.row.orderId ? undefined : params.row,
          );
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${rowSelection?.orderId}" không? Hành động này không thể hoàn tác.`}
        confirmButtonColor="error"
        confirmButtonVariant="contained"
        confirmButtonTitle="Xóa"
      />
    </Stack>
  );
};

export default OrderGrid;
