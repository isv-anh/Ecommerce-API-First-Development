"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useUser } from "@/providers/UserProvider/UserProvider";
import {
  getOrders,
  getGetOrdersQueryKey,
  useDeleteOrder,
} from "@e-commerce/api-client/endpoints/order";
import type { OrderResponse } from "@e-commerce/api-client/schemas/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";
import { routes } from "@/utils/pathMap";
import { SHORT_ID_LENGTH } from "./components/orderUtils";
const formatVND = (value: number | undefined) => {
  if (value === undefined || value === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const getStatusChip = (status: string) => {
  const upper = status?.toUpperCase();
  switch (upper) {
    case "PENDING":
      return (
        <Chip
          label="Chờ xử lý"
          color="warning"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "CONFIRMED":
      return (
        <Chip
          label="Đã xác nhận"
          color="info"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "SHIPPING":
      return (
        <Chip
          label="Đang giao hàng"
          color="primary"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "COMPLETED":
      return (
        <Chip
          label="Hoàn thành"
          color="success"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "CANCELLED":
      return (
        <Chip
          label="Đã hủy"
          color="error"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    default:
      return (
        <Chip
          label={status || "Không xác định"}
          color="default"
          size="small"
          className="font-bold text-xs"
        />
      );
  }
};

export const UserOrderList = () => {
  const { userId, isInitialized } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const deleteOrderMutation = useDeleteOrder();

  const statusParam = selectedStatus === "ALL" ? undefined : selectedStatus;
  const queryParams = userId ? { userId, status: statusParam } : undefined;

  const { data, isLoading } = useQuery({
    queryKey: getGetOrdersQueryKey(queryParams),
    queryFn: () => getOrders(queryParams),
    enabled: Boolean(userId),
  });

  const orders = data?.orders || [];

  const handleCancelOrder = async () => {
    if (!cancelTargetId) return;
    try {
      await deleteOrderMutation.mutateAsync({ orderId: cancelTargetId });
      await queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
      enqueueSnackbar("Đã hủy đơn hàng thành công!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error?.message || "Không thể hủy đơn hàng", {
        variant: "error",
      });
    } finally {
      setCancelTargetId(null);
    }
  };

  if (!isInitialized) {
    return (
      <Container maxWidth="lg" className="py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container maxWidth="md" className="py-12">
        <Paper
          elevation={0}
          className="p-8 text-center rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <ShoppingBagIcon className="text-6xl text-slate-400 mb-3" />
          <Typography
            variant="header"
            className="font-bold text-slate-900 block mb-2"
          >
            Bạn chưa đăng nhập
          </Typography>
          <p className="text-slate-500 text-sm mb-6">
            Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.
          </p>
          <Link href="/auth/login">
            <Button
              variant="contained"
              className="bg-indigo-600 hover:bg-indigo-700 normal-case px-6 py-2 rounded-xl"
            >
              Đăng nhập ngay
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Đơn mua của tôi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý và theo dõi danh sách đơn hàng đã mua
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Paper
        elevation={0}
        className="mb-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs"
      >
        <Tabs
          value={selectedStatus}
          onChange={(_, val) => setSelectedStatus(val)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          className="px-3"
        >
          <Tab
            label="Tất cả"
            value="ALL"
            className="font-bold normal-case text-sm"
          />
          <Tab
            label="Chờ xử lý"
            value="PENDING"
            className="font-bold normal-case text-sm"
          />
          <Tab
            label="Đã xác nhận"
            value="CONFIRMED"
            className="font-bold normal-case text-sm"
          />
          <Tab
            label="Đang giao"
            value="SHIPPING"
            className="font-bold normal-case text-sm"
          />
          <Tab
            label="Hoàn thành"
            value="COMPLETED"
            className="font-bold normal-case text-sm"
          />
          <Tab
            label="Đã hủy"
            value="CANCELLED"
            className="font-bold normal-case text-sm"
          />
        </Tabs>
      </Paper>

      {/* Order List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48">
          <CircularProgress />
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Đang tải danh sách đơn hàng...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Paper
          elevation={0}
          className="p-10 text-center rounded-2xl border border-slate-200 bg-white shadow-xs"
        >
          <ShoppingBagIcon className="text-6xl text-slate-300 mb-3" />
          <h3 className="font-bold text-lg text-slate-800 mb-1">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-slate-500 text-xs mb-6">
            {selectedStatus === "ALL"
              ? "Bạn chưa có đơn hàng nào trong hệ thống."
              : `Không có đơn hàng nào ở trạng thái này.`}
          </p>
          <Link href="/product">
            <Button
              variant="contained"
              className="bg-indigo-600 hover:bg-indigo-700 normal-case px-6 py-2.5 rounded-xl"
            >
              Khám phá sản phẩm
            </Button>
          </Link>
        </Paper>
      ) : (
        <div className="space-y-4">
          {orders.map((order: OrderResponse) => {
            const isPending = order.status?.toUpperCase() === "PENDING";

            return (
              <Paper
                key={order.orderId}
                elevation={0}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        #{order.orderId.slice(0, SHORT_ID_LENGTH)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("vi-VN")
                          : "-"}
                      </span>
                    </div>
                    <div>{getStatusChip(order.status)}</div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div>
                      <p className="text-xs text-slate-500">
                        Tạm tính:{" "}
                        <span className="font-semibold text-slate-700">
                          {formatVND(order.totalAmount)}
                        </span>
                        {order.totalDiscount > 0 && (
                          <span className="ml-2 text-red-500">
                            | Giảm: {formatVND(order.totalDiscount)}
                          </span>
                        )}
                      </p>
                      <p className="text-lg font-black text-indigo-600 mt-0.5">
                        Thành tiền: {formatVND(order.finalAmount)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => setCancelTargetId(order.orderId)}
                          className="rounded-xl normal-case font-semibold"
                        >
                          Hủy đơn
                        </Button>
                      )}

                      {isPending && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<PaymentIcon />}
                          onClick={() =>
                            router.push(routes.me.order.detail(order.orderId))
                          }
                          className="rounded-xl normal-case font-semibold"
                        >
                          Thanh toán
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          router.push(routes.me.order.detail(order.orderId))
                        }
                        className="rounded-xl normal-case font-semibold bg-indigo-600 hover:bg-indigo-700"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </Paper>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Order Cancellation */}
      <ConfirmDialog
        open={Boolean(cancelTargetId)}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleCancelOrder}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmButtonColor="error"
        confirmButtonVariant="contained"
        confirmButtonTitle="Xác nhận hủy"
      />
    </Container>
  );
};
