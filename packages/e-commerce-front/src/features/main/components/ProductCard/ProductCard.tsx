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
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:border-gray-900"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          aspectRatio: "1/1",
          position: "relative",
          overflow: "hidden",
          bgcolor: "#f9fafb",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.productName}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
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
          className="product-actions absolute right-3 bottom-3 opacity-100 md:opacity-0 md:translate-y-2 pointer-events-auto md:pointer-events-none transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto z-10"
          direction="row"
          spacing={1}
        >
          <IconButton
            aria-label="Xem nhanh"
            href={`/product/${product.slug}`}
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
            variant="boldS"
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
            <Typography variant="title" sx={{ color: "#111827", fontSize: "1.15rem" }}>
              {formatPrice(product.price)}
            </Typography>
            <Typography variant="regularXs" color="text.secondary">
              {product.location}
            </Typography>
          </Stack>

          <Button
            href={`/product/${product.slug}`}
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: "8px", bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#333" }, py: 1, fontSize: "0.9rem" }}
          >
            Xem sản phẩm
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
