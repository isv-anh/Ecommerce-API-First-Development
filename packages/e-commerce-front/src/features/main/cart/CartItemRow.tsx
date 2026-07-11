"use client";

import React, { useEffect } from "react";
import {
  useGetProductVariantByIdSuspense,
  useGetProductByProductIdSuspense,
} from "@e-commerce/api-client/endpoints/product";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Image from "next/image";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

interface CartItemRowProps {
  item: any;
  onUpdateQuantity: (variantId: string, currentQty: number, delta: number) => void;
  onDelete: (variantId: string) => void;
  onDetailsResolved: (variantId: string, details: { price: number; name: string; thumbnail: string }) => void;
}

export const CartItemRow = ({
  item,
  onUpdateQuantity,
  onDelete,
  onDetailsResolved,
}: CartItemRowProps) => {
  const { data: variant } = useGetProductVariantByIdSuspense(item.productVariantId);
  const { data: product } = useGetProductByProductIdSuspense(variant.productId);

  useEffect(() => {
    onDetailsResolved(item.productVariantId, {
      price: variant.price,
      name: product.productName,
      thumbnail: variant.thumbnailUrl || product.thumbnailUrl || "",
    });
  }, [item.productVariantId, variant.price, variant.thumbnailUrl, product.productName, product.thumbnailUrl, onDetailsResolved]);

  const attrLabel = variant.variantAttributes
    ? variant.variantAttributes.map((a: any) => `${a.attributeName}: ${a.attributeValue}`).join(", ")
    : "";

  const imageUrl = variant.thumbnailUrl || product.thumbnailUrl || "";

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Product Image */}
        <Grid size={{ xs: 3, sm: 2 }}>
          <Box
            sx={{
              aspectRatio: "1/1",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f8fafc",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {imageUrl ? (
              <Image src={imageUrl} alt={product.productName} fill style={{ objectFit: "cover" }} />
            ) : (
              <Stack alignItems="center" justifyContent="center" height="100%">
                <Typography variant="regularXs" color="text.secondary">
                  No Image
                </Typography>
              </Stack>
            )}
          </Box>
        </Grid>

        {/* Product Title and Attribute */}
        <Grid size={{ xs: 9, sm: 5 }}>
          <Stack spacing={0.5}>
            <Typography variant="boldM" color="text.primary" sx={{ lineHeight: 1.3 }}>
              {product.productName}
            </Typography>
            {attrLabel && (
              <Typography variant="regularXs" color="text.secondary">
                {attrLabel}
              </Typography>
            )}
            <Typography variant="regularXs" color="text.secondary">
              Mã: {variant.sku}
            </Typography>
          </Stack>
        </Grid>

        {/* Price & Quantity */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ mt: { xs: 1.5, sm: 0 } }}
          >
            {/* Price */}
            <Typography variant="boldM" color="primary.main">
              {formatPrice(variant.price)}
            </Typography>

            {/* Quantity Selector */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f8fafc",
              }}
            >
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.productVariantId, item.quantity, -1)}
                sx={{ borderRadius: 0, p: 0.8 }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 1.5, minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.productVariantId, item.quantity, 1)}
                sx={{ borderRadius: 0, p: 0.8 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Delete button */}
            <IconButton
              color="error"
              onClick={() => onDelete(item.productVariantId)}
              sx={{
                border: "1px solid",
                borderColor: "rgba(239, 68, 68, 0.15)",
                bgcolor: "rgba(239, 68, 68, 0.02)",
                "&:hover": {
                  bgcolor: "rgba(239, 68, 68, 0.08)",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
