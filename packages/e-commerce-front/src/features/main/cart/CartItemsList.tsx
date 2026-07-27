"use client";

import React, { useState } from "react";
import {
  useGetCartItemsSuspense,
  usePatchCartItem,
  useDeleteCartItem,
  getGetCartItemsQueryKey,
} from "@e-commerce/api-client/endpoints/cart";
import { useQueryClient } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { CartItemRow } from "./CartItemRow";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

interface CartItemsListProps {
  cart: any;
}

export const CartItemsList = ({ cart }: CartItemsListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: itemsData } = useGetCartItemsSuspense(cart.cartId);
  const items = itemsData?.cartItems || [];

  const patchCartItemMutation = usePatchCartItem();
  const deleteCartItemMutation = useDeleteCartItem();

  const [itemDetails, setItemDetails] = useState<Record<string, { price: number; name: string; thumbnail: string }>>({});

  const handleDetailsResolved = React.useCallback((variantId: string, details: { price: number; name: string; thumbnail: string }) => {
    setItemDetails((prev) => {
      if (
        prev[variantId]?.price === details.price &&
        prev[variantId]?.name === details.name &&
        prev[variantId]?.thumbnail === details.thumbnail
      ) {
        return prev;
      }
      return { ...prev, [variantId]: details };
    });
  }, []);

  const handleUpdateQuantity = async (productVariantId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    try {
      if (newQty <= 0) {
        await deleteCartItemMutation.mutateAsync({ cartId: cart.cartId, productVariantId });
        enqueueSnackbar("Đã xóa sản phẩm khỏi giỏ hàng", { variant: "info" });
      } else {
        await patchCartItemMutation.mutateAsync({
          cartId: cart.cartId,
          productVariantId,
          data: { quantity: newQty },
        });
      }
      await queryClient.invalidateQueries({ queryKey: getGetCartItemsQueryKey(cart.cartId) });
    } catch {
      enqueueSnackbar("Lỗi khi cập nhật giỏ hàng", { variant: "error" });
    }
  };

  const handleDeleteItem = async (productVariantId: string) => {
    try {
      await deleteCartItemMutation.mutateAsync({ cartId: cart.cartId, productVariantId });
      enqueueSnackbar("Đã xóa sản phẩm khỏi giỏ hàng", { variant: "info" });
      await queryClient.invalidateQueries({ queryKey: getGetCartItemsQueryKey(cart.cartId) });
    } catch {
      enqueueSnackbar("Lỗi khi xóa sản phẩm", { variant: "error" });
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Compute Subtotal
  let subtotal = 0;
  let itemsCount = 0;
  for (const item of items) {
    itemsCount += item.quantity;
    const detail = itemDetails[item.productVariantId];
    if (detail) {
      subtotal += detail.price * item.quantity;
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
          Giỏ hàng của bạn đang trống
        </Typography>
        <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
          Hãy dạo quanh cửa hàng và chọn cho mình những món đồ ưng ý nhé.
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
    <Grid container spacing={4}>
      {/* Left List Column */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={2.5}>
          {items.map((item) => (
            <React.Suspense
              key={item.productVariantId}
              fallback={
                <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={30} />
                </Paper>
              }
            >
              <CartItemRow
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onDelete={handleDeleteItem}
                onDetailsResolved={handleDetailsResolved}
              />
            </React.Suspense>
          ))}
        </Stack>
      </Grid>

      {/* Right Summary Column */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "none",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography variant="boldL" sx={{ display: "block", mb: 2.5 }}>
            Tóm tắt đơn hàng
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="regularS" color="text.secondary">
                Tổng số lượng:
              </Typography>
              <Typography variant="boldS">{itemsCount} sản phẩm</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="regularS" color="text.secondary">
                Tạm tính:
              </Typography>
              <Typography variant="boldS">{formatPrice(subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="regularS" color="text.secondary">
                Phí vận chuyển:
              </Typography>
              <Typography variant="boldS">
                {shippingFee === 0 ? (
                  <span style={{ color: "#22C55E" }}>Miễn phí</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </Typography>
            </Stack>

            {shippingFee > 0 && (
              <Typography variant="regularXs" color="text.secondary" sx={{ textAlign: "right", display: "block", mt: -1 }}>
                (Miễn phí vận chuyển cho đơn hàng từ {formatPrice(FREE_SHIPPING_THRESHOLD)})
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="boldM">Tổng cộng:</Typography>
              <Typography variant="boldL" color="primary.main" sx={{ fontSize: "22px", fontWeight: 800 }}>
                {formatPrice(total)}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                mt: 2,
                fontWeight: 700,
                borderRadius: 2.5,
              }}
            >
              Tiến hành thanh toán
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};
