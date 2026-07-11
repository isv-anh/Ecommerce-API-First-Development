"use client";

import React from "react";
import {
  useGetWishlistItemsSuspense,
  useDeleteWishlistItem,
  getGetWishlistItemsQueryKey,
} from "@e-commerce/api-client/endpoints/customer";
import { useQueryClient } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { WishlistItemCard } from "./WishlistItemCard";

interface WishlistItemsListProps {
  wishlistId: string;
}

export const WishlistItemsList = ({ wishlistId }: WishlistItemsListProps) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const deleteWishlistItemMutation = useDeleteWishlistItem();

  const { data: itemsData } = useGetWishlistItemsSuspense(wishlistId);
  const items = itemsData?.wishlistItems || [];

  const handleDelete = async (wishlistItemId: string) => {
    try {
      await deleteWishlistItemMutation.mutateAsync({
        wishlistId,
        wishlistItemId,
      });
      enqueueSnackbar("Đã xóa sản phẩm khỏi danh sách yêu thích", { variant: "info" });
      await queryClient.invalidateQueries({
        queryKey: getGetWishlistItemsQueryKey(wishlistId),
      });
    } catch (err) {
      enqueueSnackbar("Có lỗi xảy ra khi xóa", { variant: "error" });
    }
  };

  if (items.length === 0) {
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

  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.wishlistItemId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <React.Suspense
            fallback={
              <Paper sx={{ p: 4, display: "flex", justifyContent: "center", height: "100%" }}>
                <CircularProgress size={30} />
              </Paper>
            }
          >
            <WishlistItemCard item={item} wishlistId={wishlistId} onDelete={handleDelete} />
          </React.Suspense>
        </Grid>
      ))}
    </Grid>
  );
};
