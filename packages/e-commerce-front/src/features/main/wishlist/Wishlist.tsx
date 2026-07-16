"use client";

import React, { useState, useEffect } from "react";
import { useGetWishlistsSuspense } from "@e-commerce/api-client/endpoints/customer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { WishlistItemsList } from "./WishlistItemsList";
import { useUser } from "@/providers/UserProvider/UserProvider";

const Wishlist = () => {
  const { userId, isInitialized } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [isInitialized]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack alignItems="center" justifyContent="center" height="50vh">
          <CircularProgress />
          <Typography variant="regularS" color="text.secondary" mt={2}>
            Đang tải danh sách yêu thích...
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
          <FavoriteIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
            Bạn chưa đăng nhập
          </Typography>
          <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
            Vui lòng đăng nhập tài khoản của bạn để quản lý danh sách sản phẩm yêu thích.
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
        Danh sách yêu thích
      </Typography>

      <React.Suspense
        fallback={
          <Stack alignItems="center" justifyContent="center" height="30vh">
            <CircularProgress />
          </Stack>
        }
      >
        <WishlistLoader userId={userId} />
      </React.Suspense>
    </Container>
  );
};

const WishlistLoader = ({ userId }: { userId: string }) => {
  const { data: wishlistsData } = useGetWishlistsSuspense({ userId });
  const wishlists = wishlistsData?.wishlists || [];
  const wishlistId = wishlists[0]?.wishlistId || "";

  if (!wishlistId) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <FavoriteIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
          Danh sách yêu thích trống
        </Typography>
        <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
          Hãy dạo quanh cửa hàng và thêm những món đồ bạn yêu thích vào đây nhé.
        </Typography>
        <Link href="/product">
          <Button variant="contained" startIcon={<ArrowBackIcon />}>
            Quay lại cửa hàng
          </Button>
        </Link>
      </Paper>
    );
  }

  return <WishlistItemsList wishlistId={wishlistId} />;
};

export default Wishlist;
