"use client";

import React, { useState, useEffect } from "react";
import { getCart } from "@e-commerce/api-client/endpoints/cart";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { CartItemsList } from "./CartItemsList";
import { useUser } from "@/providers/UserProvider/UserProvider";

const Cart = () => {
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

    setLoading(true);
    getCart({ userId })
      .then((data) => setCart(data))
      .catch((err) => {
        console.log("Cart empty or not found:", err);
      })
      .finally(() => setLoading(false));
  }, [userId, isInitialized]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" justifyContent="center" height="50vh">
          <CircularProgress />
          <Typography variant="regularS" color="text.secondary" mt={2}>
            Đang tải giỏ hàng...
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
          <ShoppingBagIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
            Bạn chưa đăng nhập
          </Typography>
          <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
            Vui lòng đăng nhập tài khoản của bạn để quản lý giỏ hàng và mua sắm tiện lợi.
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
      <Typography variant="title" sx={{ fontSize: "30px", fontWeight: 800, mb: 4 }}>
        Giỏ hàng của bạn
      </Typography>

      {!cart ? (
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
      ) : (
        <CartItemsList cart={cart} />
      )}
    </Container>
  );
};

export default Cart;
