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
      startIcon={
        isFavorite ? (
          <FavoriteIcon
            sx={{
              animation: "pulse 0.4s ease-in-out",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.25)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
        ) : (
          <FavoriteBorderIcon />
        )
      }
      onClick={() => handleAddToWishlist(isFavorite, wishlistItemsData?.wishlistItems || [])}
      className={`flex-1 py-2 px-4 text-[14px] font-semibold rounded-xl transition-all duration-300 ${
        isFavorite
          ? "bg-linear-to-br from-[#ff4b6e] to-[#ff758c] text-white shadow-[0_8px_16px_-4px_rgba(255,75,110,0.4)] border-none hover:from-[#f43f5e] hover:to-[#ff4b6e] hover:shadow-[0_12px_20px_-4px_rgba(255,75,110,0.5)] hover:-translate-y-0.5 active:scale-95"
          : "border-[1.5px] border-gray-200 text-gray-500 hover:border-[#ff4b6e] hover:text-[#ff4b6e] hover:bg-[#ff4b6e]/5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,75,110,0.1)] active:scale-95"
      }`}
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
        className="flex-1 py-2 px-4 text-[14px] font-semibold rounded-xl border-[1.5px] border-gray-200 text-gray-500 transition-all duration-300 hover:border-[#ff4b6e] hover:text-[#ff4b6e] hover:bg-[#ff4b6e]/5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,75,110,0.1)] active:scale-95"
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
        className="flex-1 py-2 px-4 text-[14px] font-semibold rounded-xl border-[1.5px] border-gray-200 text-gray-500 transition-all duration-300 hover:border-[#ff4b6e] hover:text-[#ff4b6e] hover:bg-[#ff4b6e]/5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,75,110,0.1)] active:scale-95"
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
          className="flex-1 py-2 px-4 text-[14px] font-semibold rounded-xl border-[1.5px] border-gray-200 text-gray-400"
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
