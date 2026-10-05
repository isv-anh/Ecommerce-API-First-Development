"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type {
  OrderItemResponse,
  OrderResponse,
} from "@e-commerce/api-client/schemas/order";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

/** Translate order statuses into customer-facing labels. */
const statusConfig = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return { label: "Chờ xử lý", color: "warning" as const };
    case "CONFIRMED":
      return { label: "Đã xác nhận", color: "info" as const };
    case "SHIPPING":
      return { label: "Đang giao hàng", color: "primary" as const };
    case "COMPLETED":
      return { label: "Hoàn thành", color: "success" as const };
    case "CANCELLED":
      return { label: "Đã hủy", color: "error" as const };
    default:
      return { label: status || "Đang cập nhật", color: "default" as const };
  }
};

/** Display an order image with a fallback for missing or expired image URLs. */
const OrderProductImage = ({ item }: { item: OrderItemResponse }) => {
  const [failedUrl, setFailedUrl] = useState<string>();
  return (
    <Box
      sx={{
        width: { xs: 72, sm: 88 },
        height: { xs: 72, sm: 88 },
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "action.hover",
        display: "grid",
        placeItems: "center",
      }}
    >
      {item.thumbnailUrl && failedUrl !== item.thumbnailUrl ? (
        <Box
          component="img"
          src={item.thumbnailUrl}
          alt={item.productName}
          loading="lazy"
          onError={() => setFailedUrl(item.thumbnailUrl || undefined)}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <ImageNotSupportedOutlinedIcon
          aria-label="Chưa có ảnh sản phẩm"
          color="disabled"
        />
      )}
    </Box>
  );
};

/** Show purchased products and historical prices in a responsive customer order card. */
export default function OrderCard({
  order,
  items,
  children,
  actions,
}: {
  order: OrderResponse;
  items?: OrderItemResponse[];
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const status = statusConfig(order.status);
  return (
    <Paper
      component="article"
      aria-label={`Đơn hàng ${order.orderId}`}
      variant="outlined"
      sx={{ borderRadius: 3, overflow: "hidden" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "action.hover" }}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="boldM" title={order.orderId}>
            Đơn hàng #{order.orderId.split("-")[0].toUpperCase()}
          </Typography>
          <Typography variant="regularXs" color="text.secondary">
            Đặt ngày {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
        </Stack>
        <Chip label={status.label} color={status.color} size="small" />
      </Stack>
      <Stack spacing={2.5} divider={<Divider />} sx={{ p: { xs: 2, sm: 3 } }}>
        {items?.map((item) => (
          <Stack
            key={item.orderItemId}
            direction="row"
            spacing={2}
            alignItems="flex-start"
          >
            <OrderProductImage item={item} />
            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="boldM" sx={{ overflowWrap: "anywhere" }}>
                {item.productName}
              </Typography>
              {item.variantName && (
                <Typography variant="regularXs" color="text.secondary">
                  Phân loại: {item.variantName}
                </Typography>
              )}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={0.5}
              >
                <Typography variant="regularS" color="text.secondary">
                  {currency.format(item.price)} × {item.quantity}
                </Typography>
                <Typography variant="boldM">
                  {currency.format(item.totalPrice)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
        {items?.length === 0 && (
          <Typography variant="regularS" color="text.secondary">
            Đơn hàng này chưa có thông tin sản phẩm.
          </Typography>
        )}
        {children}
      </Stack>
      <Divider />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
      >
        <Typography variant="regularXs" color="text.secondary">
          {items
            ? `${items.reduce((count, item) => count + item.quantity, 0)} sản phẩm`
            : "Sản phẩm đã mua"}
          {order.totalDiscount > 0 &&
            ` · Đã giảm ${currency.format(order.totalDiscount)}`}
        </Typography>
        {actions}
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="regularS" color="text.secondary">
            Thành tiền
          </Typography>
          <Typography variant="boldL" color="primary.main">
            {currency.format(order.finalAmount)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
