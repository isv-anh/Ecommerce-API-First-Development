"use client";
import Card from "@mui/material/Card";
import { ProductCardProps } from "./types";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const formatPrice = (value: number | string) => {
  try {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);
  } catch {
    return String(value);
  }
};

const ProductCard = ({ product }: ProductCardProps) => {
  const handleQuickView = () => {
    // placeholder quick view

    console.log("quick view", product);
  };

  const handleAddToWishlist = () => {
    console.log("wishlist", product);
  };

  const handleAddToCart = () => {
    console.log("add to cart", product);
  };

  return (
    <Card
      sx={{
        transition:
          "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s",
        transformOrigin: "center",
        "&:hover": {
          boxShadow: 12,
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "visible",
        bgcolor: "background.paper",
        "&:focus-within": {
          boxShadow: 8,
        },

        "&:hover .product-overlay": {
          opacity: 1,
          pointerEvents: "auto",
          transform: "translateY(0)",
        },
      }}
    >
      {/* Image area with overlay actions */}
      <Box
        className="image-top"
        sx={{
          aspectRatio: "4/3",
          width: "100%",
          position: "relative",
          bgcolor: "grey.100",
          borderTop: "4px solid transparent",
          overflow: "hidden",
        }}
      >
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.productName}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
            }}
          >
            <Typography color="text.secondary">No image available</Typography>
          </Box>
        )}

        {/* overlay actions */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pb: 1.5,
            transition: "opacity 0.18s ease, transform 0.18s ease",
            opacity: 0,
            pointerEvents: "none",
            "${Card}:hover &": {
              opacity: 1,
              pointerEvents: "auto",
            },
          }}
          className="product-overlay"
        >
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="Quick view"
              onClick={handleQuickView}
              sx={(theme) => ({
                bgcolor: theme.palette.common.white,
                color: theme.palette.info.main,
                "&:hover": {
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.common.white,
                },
              })}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Add to wishlist"
              onClick={handleAddToWishlist}
              sx={(theme) => ({
                bgcolor: theme.palette.common.white,
                color: theme.palette.error.main,
                "&:hover": {
                  bgcolor: theme.palette.error.main,
                  color: theme.palette.common.white,
                },
              })}
            >
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Add to cart"
              onClick={handleAddToCart}
              sx={(theme) => ({
                bgcolor: theme.palette.common.white,
                color: theme.palette.success.main,
                "&:hover": {
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.common.white,
                },
              })}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      <CardContent sx={{ pt: 2, pb: 1, flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography
            variant="boldM"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.productName}
          </Typography>

          <Typography variant="regularS" sx={{ color: "text.secondary" }}>
            {product.shopName || ""}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1 }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              {formatPrice(product.price)}
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleAddToCart}
              startIcon={<ShoppingCartIcon />}
            >
              Thêm
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
