"use client";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import useFabs from "@/components/inputs/Fabs/provider/hooks/useFabs";
import { routes } from "@/utils/pathMap";
import {
  getGetOrdersQueryKey,
  useDeleteOrder,
  useGetOrderByIdSuspense,
  useGetOrderItemsSuspense,
  useGetPaymentsSuspense,
} from "@e-commerce/api-client/endpoints/order";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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

const OrderItemsSection = ({ orderId }: { orderId: string }) => {
  const { data } = useGetOrderItemsSuspense(orderId);
  const items = data.orderItems || [];

  if (items.length === 0) {
    return (
      <Typography variant="regularS" color="text.secondary">
        Không có sản phẩm nào trong đơn hàng.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Biến thể</TableCell>
            <TableCell align="right">Đơn giá</TableCell>
            <TableCell align="right">Số lượng</TableCell>
            <TableCell align="right">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.orderItemId}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.variantName || "-"}</TableCell>
              <TableCell align="right">{formatVND(item.price)}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{formatVND(item.totalPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PaymentsSection = ({ orderId }: { orderId: string }) => {
  const { data } = useGetPaymentsSuspense(orderId);
  const payments = data.payments || [];

  if (payments.length === 0) {
    return (
      <Typography variant="regularS" color="text.secondary">
        Chưa có lịch sử thanh toán.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Mã thanh toán</TableCell>
            <TableCell>Phương thức</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right">Số tiền</TableCell>
            <TableCell>Ngày tạo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.paymentId}>
              <TableCell>{payment.paymentId}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>{getStatusChip(payment.status)}</TableCell>
              <TableCell align="right">{formatVND(payment.amount)}</TableCell>
              <TableCell>
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleString("vi-VN")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const OrderDetail = ({ orderId }: { orderId: string }) => {
  const queryOrder = useGetOrderByIdSuspense(orderId);
  const deleteOrder = useDeleteOrder();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setFabs, clear } = useFabs();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const order = queryOrder.data;

  useEffect(() => {
    setFabs([{ type: "back", href: routes.admin.order.list }]);
    return () => {
      clear();
    };
  }, [clear, setFabs]);

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteOrder.mutateAsync({ orderId });
      queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
      enqueueSnackbar({
        message: "Xóa đơn hàng thành công",
        variant: "success",
      });
      router.push(routes.admin.order.list);
    } catch (error) {
      enqueueSnackbar({
        message: (error as Error).message || "Không thể xóa đơn hàng",
        variant: "error",
      });
    }
  };

  return (
    <Paper sx={{ p: 3, minHeight: "calc(100vh - 145px)" }}>
      <Stack spacing={3}>
        {/* Header Information */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="header">Chi tiết đơn hàng</Typography>
          <Box display="flex" gap={1} alignItems="center">
            {getStatusChip(order.status)}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmOpen(true)}
              size="small"
            >
              Xóa đơn hàng
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Order Details Summary */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="regularXs" color="text.secondary">
              Mã đơn hàng
            </Typography>
            <Typography variant="regularM">{order.orderId}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="regularXs" color="text.secondary">
              Mã khách hàng (User ID)
            </Typography>
            <Typography variant="regularM">{order.userId}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="regularXs" color="text.secondary">
              Ngày tạo
            </Typography>
            <Typography variant="regularM">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN")
                : "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="regularXs" color="text.secondary">
              Tổng tiền thanh toán
            </Typography>
            <Typography variant="boldL" color="primary.main">
              {formatVND(order.finalAmount)}
            </Typography>
          </Grid>
        </Grid>

        {/* Price Breakdown */}
        <Paper
          variant="outlined"
          sx={{ p: 2, backgroundColor: "action.hover" }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="regularS" color="text.secondary">
                Tạm tính (Total Amount):
              </Typography>
              <Typography variant="boldM">{formatVND(order.totalAmount)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="regularS" color="text.secondary">
                Giảm giá (Total Discount):
              </Typography>
              <Typography variant="boldM" color="error.main">
                -{formatVND(order.totalDiscount)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="regularS" color="text.secondary">
                Thành tiền (Final Amount):
              </Typography>
              <Typography variant="boldM" color="success.main">
                {formatVND(order.finalAmount)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider />

        {/* Order Items Section */}
        <Box>
          <Typography variant="subtitle" mb={1.5}>
            Danh sách sản phẩm
          </Typography>
          <SuspenseWrapper height={150}>
            <OrderItemsSection orderId={orderId} />
          </SuspenseWrapper>
        </Box>

        <Divider />

        {/* Payments Section */}
        <Box>
          <Typography variant="subtitle" mb={1.5}>
            Lịch sử thanh toán
          </Typography>
          <SuspenseWrapper height={150}>
            <PaymentsSection orderId={orderId} />
          </SuspenseWrapper>
        </Box>
      </Stack>

      <Backdrop open={deleteOrder.isPending} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${orderId}" không? Hành động này không thể hoàn tác.`}
        confirmButtonColor="error"
        confirmButtonVariant="contained"
        confirmButtonTitle="Xóa"
      />
    </Paper>
  );
};

export default OrderDetail;
