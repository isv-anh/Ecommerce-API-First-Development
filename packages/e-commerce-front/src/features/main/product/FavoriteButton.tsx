"use client";

import React from "react";
import {
  useGetWishlistsSuspense,
  useGetWishlistItemsSuspense,
} from "@e-commerce/api-client/endpoints/customer";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ActiveFavoriteItemsProps {
  productId: string;
  wishlistId: string;
  handleAddToWishlist: (isFavorite: boolean, wishlistItems: any[]) => Promise<void>;
}

const ActiveFavoriteItems = ({
  productId,
  wishlistId,
  handleAddToWishlist,
}: ActiveFavoriteItemsProps) => {
  const { data: wishlistItemsData } = useGetWishlistItemsSuspense(wishlistId);
  const isFavorite = wishlistItemsData?.wishlistItems?.some(
    (item) => item.productId === productId
  ) || false;

  return (
    <Button
      variant={isFavorite ? "contained" : "outlined"}
      startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      onClick={() => handleAddToWishlist(isFavorite, wishlistItemsData?.wishlistItems || [])}
      sx={{
        flex: 1,
        py: 1,
        px: 2,
        fontSize: "14px",
        fontWeight: 600,
        borderRadius: 2.5,
        ...(isFavorite
          ? {
              background: "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)",
              boxShadow: "0 4px 12px rgba(244, 63, 94, 0.2)",
              color: "common.white",
              border: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)",
              },
            }
          : {
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": {
                borderColor: "primary.light",
                color: "primary.main",
                bgcolor: "rgba(130, 37, 236, 0.02)",
              },
            }),
      }}
    >
      {isFavorite ? "Đã thích" : "Yêu thích"}
    </Button>
  );
};

interface ActiveFavoriteButtonProps {
  productId: string;
  userId: string;
  handleAddToWishlist: (isFavorite: boolean, wishlistItems: any[]) => Promise<void>;
}

const ActiveFavoriteButton = ({
  productId,
  userId,
  handleAddToWishlist,
}: ActiveFavoriteButtonProps) => {
  const { data: wishlistsData } = useGetWishlistsSuspense({ userId });
  const wishlists = wishlistsData?.wishlists || [];
  const wishlistId = wishlists[0]?.wishlistId || "";

  if (!wishlistId) {
    return (
      <Button
        variant="outlined"
        startIcon={<FavoriteBorderIcon />}
        onClick={() => handleAddToWishlist(false, [])}
        sx={{
          flex: 1,
          py: 1,
          px: 2,
          fontSize: "14px",
          fontWeight: 600,
          borderRadius: 2.5,
          borderColor: "divider",
          color: "text.secondary",
          "&:hover": {
            borderColor: "primary.light",
            color: "primary.main",
            bgcolor: "rgba(130, 37, 236, 0.02)",
          },
        }}
      >
        Yêu thích
      </Button>
    );
  }

  return (
    <ActiveFavoriteItems
      productId={productId}
      wishlistId={wishlistId}
      handleAddToWishlist={handleAddToWishlist}
    />
  );
};

interface FavoriteButtonProps {
  productId: string;
  userId: string | null;
  handleAddToWishlist: (isFavorite: boolean, wishlistItems: any[]) => Promise<void>;
}

export const FavoriteButton = ({
  productId,
  userId,
  handleAddToWishlist,
}: FavoriteButtonProps) => {
  if (!userId) {
    return (
      <Button
        variant="outlined"
        startIcon={<FavoriteBorderIcon />}
        onClick={() => handleAddToWishlist(false, [])}
        sx={{
          flex: 1,
          py: 1,
          px: 2,
          fontSize: "14px",
          fontWeight: 600,
          borderRadius: 2.5,
          borderColor: "divider",
          color: "text.secondary",
          "&:hover": {
            borderColor: "primary.light",
            color: "primary.main",
            bgcolor: "rgba(130, 37, 236, 0.02)",
          },
        }}
      >
        Yêu thích
      </Button>
    );
  }

  return (
    <React.Suspense
      fallback={
        <Button
          variant="outlined"
          disabled
          startIcon={<FavoriteBorderIcon />}
          sx={{
            flex: 1,
            py: 1,
            px: 2,
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: 2.5,
            borderColor: "divider",
            color: "text.disabled",
          }}
        >
          Yêu thích
        </Button>
      }
    >
      <ActiveFavoriteButton
        productId={productId}
        userId={userId}
        handleAddToWishlist={handleAddToWishlist}
      />
    </React.Suspense>
  );
};
