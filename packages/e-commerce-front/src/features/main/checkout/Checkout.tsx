"use client";

import React, { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useUser } from "@/providers/UserProvider/UserProvider";
import { getCart, useGetCartItemsSuspense, useDeleteCartItem, getGetCartItemsQueryKey, getGetCartQueryKey } from "@e-commerce/api-client/endpoints/cart";
import { usePostOrder, usePostOrderItem, usePostPayment, getGetOrdersQueryKey } from "@e-commerce/api-client/endpoints/order";
import { useQueryClient } from "@tanstack/react-query";
import type { ResolvedCheckoutItem } from "./CheckoutItemRow";
import { routes } from "@/utils/pathMap";

import { DeliveryInfoForm } from "./components/DeliveryInfoForm/DeliveryInfoForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector/PaymentMethodSelector";
import { CheckoutOrderSummary } from "./components/CheckoutOrderSummary/CheckoutOrderSummary";
import { CheckoutEmptyState } from "./components/CheckoutEmptyState/CheckoutEmptyState";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  note: z.string().optional(),
  paymentMethod: z.string(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

const CheckoutForm = ({ cart, userId }: { cart: any; userId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: itemsData } = useGetCartItemsSuspense(cart.cartId);
  const cartItems = itemsData?.cartItems || [];

  const postOrderMutation = usePostOrder();
  const postOrderItemMutation = usePostOrderItem();
  const postPaymentMutation = usePostPayment();
  const deleteCartItemMutation = useDeleteCartItem();

  const [resolvedItems, setResolvedItems] = useState<Record<string, ResolvedCheckoutItem>>({});
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      note: "",
      paymentMethod: "COD",
    },
  });

  const handleItemResolved = useCallback((item: ResolvedCheckoutItem) => {
    setResolvedItems((prev) => ({
      ...prev,
      [item.productVariantId]: item,
    }));
  }, []);

  let subtotal = 0;
  for (const item of cartItems) {
    const detail = resolvedItems[item.productVariantId];
    if (detail) {
      subtotal += detail.price * item.quantity;
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  const onSubmit = async (data: CheckoutFormValues) => {

    setSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await postOrderMutation.mutateAsync({
        data: { userId },
      });
      const orderId = orderRes.orderId;

      // 2. Create order items
      for (const item of cartItems) {
        const detail = resolvedItems[item.productVariantId];
        await postOrderItemMutation.mutateAsync({
          orderId,
          data: {
            productId: detail?.productId || "",
            productVariantId: item.productVariantId,
            productName: detail?.productName || "Sản phẩm",
            variantName: detail?.variantName || "",
            price: detail?.price || 0,
            quantity: item.quantity,
          },
        });
      }

      // 3. Create payment record
      await postPaymentMutation.mutateAsync({
        orderId,
        data: {
          method: data.paymentMethod,
          amount: totalAmount,
        },
      });

      // 4. Clear items from cart
      for (const item of cartItems) {
        try {
          await deleteCartItemMutation.mutateAsync({
            cartId: cart.cartId,
            productVariantId: item.productVariantId,
          });
        } catch {
          // ignore individual item deletion errors
        }
      }

      await queryClient.invalidateQueries({ queryKey: getGetCartItemsQueryKey(cart.cartId) });
      await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });

      enqueueSnackbar("Đặt hàng thành công!", { variant: "success" });
      router.push(routes.me.order.detail(orderId));
    } catch (error: any) {
      console.error("Order creation failed:", error);
      enqueueSnackbar(error?.message || "Đặt hàng không thành công. Vui lòng thử lại!", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Left Column: Delivery & Payment Details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <DeliveryInfoForm />
              <PaymentMethodSelector />
            </Stack>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <CheckoutOrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
              onItemResolved={handleItemResolved}
              submitting={submitting}
            />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export const Checkout = () => {
  const { userId, isInitialized } = useUser();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    if (!isInitialized) return;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    getCart({ userId })
      .then((data) => setCart(data))
      .catch((err) => console.log("Cart fetch error:", err))
      .finally(() => setLoading(false));
  }, [userId, isInitialized]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" justifyContent="center" height="50vh">
          <CircularProgress />
          <Typography variant="regularS" color="text.secondary" mt={2}>
            Đang khởi tạo trang thanh toán...
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
            Bạn chưa đăng nhập
          </Typography>
          <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
            Vui lòng đăng nhập để hoàn tất đơn hàng.
          </Typography>
          <Link href="/auth/login">
            <Button variant="contained">Đăng nhập ngay</Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Link href={routes.cart}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} size="small">
            Giỏ hàng
          </Button>
        </Link>
        <Typography variant="title" sx={{ fontSize: "28px", fontWeight: 800 }}>
          Thanh toán đơn hàng
        </Typography>
      </Stack>

      {!cart ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
            Không tìm thấy giỏ hàng
          </Typography>
          <Link href="/product">
            <Button variant="contained" sx={{ mt: 2 }}>
              Khám phá sản phẩm
            </Button>
          </Link>
        </Paper>
      ) : (
        <React.Suspense
          fallback={
            <Stack alignItems="center" justifyContent="center" height="40vh">
              <CircularProgress />
            </Stack>
          }
        >
          <CheckoutForm cart={cart} userId={userId} />
        </React.Suspense>
      )}
    </Container>
  );
};
