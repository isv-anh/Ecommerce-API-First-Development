"use client";

import React from "react";
import {
  useGetOrdersSuspense,
  useGetOrderItemsSuspense,
} from "@e-commerce/api-client/endpoints/order";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { useUser } from "@/providers/UserProvider/UserProvider";
import Pagination from "@mui/material/Pagination";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import type { OrderResponse } from "@e-commerce/api-client/schemas/order";
import OrderCard from "./OrderCard";
import CancelOrderButton from "./CancelOrderButton";

const Orders = () => {
  const { userId, isInitialized } = useUser();

  if (!isInitialized) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" justifyContent="center" height="50vh">
          <CircularProgress />
          <Typography variant="regularM" color="text.secondary" mt={2}>
            Đang tải danh sách đơn hàng...
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <ReceiptIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="title" mb={1} sx={{ fontWeight: 700 }}>
            Bạn chưa đăng nhập
          </Typography>
          <Typography
            variant="regularM"
            color="text.secondary"
            mb={4}
            sx={{ display: "block" }}
          >
            Vui lòng đăng nhập tài khoản của bạn để xem danh sách đơn hàng.
          </Typography>
          <Link href="/auth/login">
            <Button variant="contained">Đăng nhập ngay</Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
      <Typography variant="header" sx={{ fontWeight: 800, mb: 4 }}>
        Đơn hàng của tôi
      </Typography>

      <React.Suspense
        fallback={
          <Stack alignItems="center" justifyContent="center" height="30vh">
            <CircularProgress />
          </Stack>
        }
      >
        <OrdersLoader userId={userId} />
      </React.Suspense>
    </Container>
  );
};

/** Load purchased items through the generated API hook. */
const OrderCardLoader = ({ order }: { order: OrderResponse }) => {
  const { data } = useGetOrderItemsSuspense(order.orderId);
  return (
    <OrderCard
      order={order}
      items={data.orderItems}
      actions={<CancelOrderButton order={order} />}
    />
  );
};

/** Isolate item loading failures so other orders remain visible. */
const OrderWithItems = ({ order }: { order: OrderResponse }) => (
  <SuspenseWrapper>
    <OrderCardLoader order={order} />
  </SuspenseWrapper>
);

const OrdersLoader = ({ userId }: { userId: string }) => {
  const [page, setPage] = React.useState(1);
  const [isPending, startTransition] = React.useTransition();
  const { data: ordersResponse } = useGetOrdersSuspense({
    userId,
    page,
    pageSize: 5,
  });
  const orders = ordersResponse?.orders || [];

  if (orders.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <ReceiptIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="title" mb={1} sx={{ fontWeight: 700 }}>
          Chưa có đơn hàng nào
        </Typography>
        <Typography
          variant="regularM"
          color="text.secondary"
          mb={4}
          sx={{ display: "block" }}
        >
          Bạn chưa thực hiện bất kỳ đơn hàng nào. Hãy mua sắm ngay nhé!
        </Typography>
        <Link href="/product">
          <Button variant="contained" startIcon={<ArrowBackIcon />}>
            Quay lại cửa hàng
          </Button>
        </Link>
      </Paper>
    );
  }

  return (
    <Stack spacing={3} aria-busy={isPending}>
      <Typography variant="regularS" color="text.secondary">
        {ordersResponse.totalCount} đơn hàng · Xem lại sản phẩm và theo dõi đơn
        hàng của bạn
      </Typography>
      {orders.map((order) => (
        <OrderWithItems key={order.orderId} order={order} />
      ))}
      {ordersResponse.totalPages > 1 && (
        <Stack alignItems="center">
          <Pagination
            count={ordersResponse.totalPages}
            page={page}
            color="primary"
            disabled={isPending}
            onChange={(_, nextPage) => startTransition(() => setPage(nextPage))}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default Orders;
