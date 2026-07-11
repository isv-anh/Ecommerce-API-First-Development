"use client";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { ProductCardProps } from "./types";

const formatPrice = (value: number | string) => {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;

  if (!Number.isFinite(n) || n <= 0) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
};

const isImageSrc = (src?: string) => {
  return Boolean(src && (src.startsWith("/") || src.startsWith("http")));
};

const ProductCard = ({ product }: ProductCardProps) => {
  const imageSrc = isImageSrc(product.thumbnailUrl)
    ? product.thumbnailUrl
    : undefined;

  return (
    <Card
      sx={{
        height: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(21, 20, 38, 0.04)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          borderColor: "rgba(129, 140, 248, 0.5)",
          boxShadow: "0 12px 30px rgba(129, 140, 248, 0.12)",
        },
        "&:hover img": {
          transform: "scale(1.06)",
        },
        "&:hover .product-actions": {
          opacity: 1,
          transform: "translateY(0)",
          pointerEvents: "auto",
        },
      }}
    >
      <Box
        sx={{
          aspectRatio: "4/3",
          position: "relative",
          overflow: "hidden",
          bgcolor: "#f5f3ff",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.productName}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%", px: 2, textAlign: "center" }}
          >
            <Typography variant="boldS" color="text.secondary">
              {product.productName}
            </Typography>
          </Stack>
        )}

        <Chip
          label={product.categoryName}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "rgba(255, 255, 255, 0.92)",
            fontWeight: 700,
          }}
        />

        <Stack
          className="product-actions"
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            right: 10,
            bottom: 10,
            opacity: { xs: 1, md: 0 },
            transform: { xs: "none", md: "translateY(8px)" },
            pointerEvents: { xs: "auto", md: "none" },
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          <IconButton
            aria-label="Xem nhanh"
            href={`/product/${product.productId}`}
            size="small"
            sx={{
              bgcolor: "common.white",
              color: "text.primary",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:hover": {
                bgcolor: "#f1f5f9",
                color: "primary.main",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Thêm vào yêu thích"
            size="small"
            sx={{
              bgcolor: "common.white",
              color: "text.primary",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:hover": {
                bgcolor: "#f1f5f9",
                color: "primary.main",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack spacing={1.25}>
          <Typography
            variant="boldM"
            sx={{
              minHeight: 44,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.productName}
          </Typography>

          <Stack spacing={0.25}>
            <Typography variant="title" color="primary.main">
              {formatPrice(product.price)}
            </Typography>
            <Typography variant="regularXs" color="text.secondary">
              {product.location}
            </Typography>
          </Stack>

          <Button
            href={`/product/${product.productId}`}
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartIcon />}
            sx={{ borderRadius: 1.5 }}
          >
            Xem sản phẩm
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
