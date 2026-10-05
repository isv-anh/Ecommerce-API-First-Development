"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  getGetOrderByIdQueryKey,
  getGetOrdersQueryKey,
  useCancelOrder,
} from "@e-commerce/api-client/endpoints/order";
import type {
  OrderResponse,
  OrdersResponse,
} from "@e-commerce/api-client/schemas/order";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";

export default function CancelOrderButton({ order }: { order: OrderResponse }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelOrder = useCancelOrder();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  if (!["PENDING", "CONFIRMED"].includes(order.status.toUpperCase())) {
    return null;
  }

  const handleCancel = () => {
    if (cancelOrder.isPending) return;
    setConfirmOpen(false);
    cancelOrder.mutate(
      { orderId: order.orderId },
      {
        onSuccess: () => {
          queryClient.setQueriesData<OrdersResponse>(
            { queryKey: getGetOrdersQueryKey() },
            (data) =>
              data && {
                ...data,
                orders: data.orders.map((item) =>
                  item.orderId === order.orderId
                    ? { ...item, status: "CANCELLED" }
                    : item,
                ),
              },
          );
          void queryClient.invalidateQueries({
            queryKey: getGetOrdersQueryKey(),
          });
          void queryClient.invalidateQueries({
            queryKey: getGetOrderByIdQueryKey(order.orderId),
          });
          enqueueSnackbar("Đã hủy đơn hàng thành công.", {
            variant: "success",
          });
        },
        onError: () => {
          enqueueSnackbar(
            "Không thể hủy đơn hàng. Vui lòng tải lại và thử lại.",
            {
              variant: "error",
            },
          );
        },
      },
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        disabled={cancelOrder.isPending}
        onClick={() => setConfirmOpen(true)}
      >
        {cancelOrder.isPending ? "Đang hủy..." : "Hủy đơn hàng"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancel}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderId.split("-")[0].toUpperCase()} không?`}
        confirmButtonTitle="Hủy đơn hàng"
        confirmButtonColor="error"
        confirmButtonVariant="contained"
      />
    </>
  );
}
