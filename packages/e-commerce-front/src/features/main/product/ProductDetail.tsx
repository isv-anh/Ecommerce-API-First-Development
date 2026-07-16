"use client";

import React, { useState } from "react";
import {
  useGetProductByProductIdSuspense,
  useGetCategoryByCategoryIdSuspense,
  useGetProductVariantsSuspense,
} from "@e-commerce/api-client/endpoints/product";
import {
  getCart,
  usePostCart,
  usePostCartItem,
  getGetCartQueryKey,
} from "@e-commerce/api-client/endpoints/cart";
import {
  getWishlists,
  usePostWishlist,
  usePostWishlistItem,
  useDeleteWishlistItem,
  getGetWishlistsQueryKey,
  getGetWishlistItemsQueryKey,
} from "@e-commerce/api-client/endpoints/customer";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/providers/UserProvider/UserProvider";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// Import extracted components
import { BrandChip } from "./BrandChip";
import { FavoriteButton } from "./FavoriteButton";
import { ProductGallery } from "./ProductGallery";
import { ProductReviews } from "./ProductReviews";

const STATUS_NOT_FOUND = 404;

const formatPrice = (value: number | string) => {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(n) || n <= 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
};

const ProductDetail = ({ productId }: { productId: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  // Instantiate mutation hooks and queryClient
  const queryClient = useQueryClient();
  const postCartMutation = usePostCart();
  const postCartItemMutation = usePostCartItem();
  const postWishlistMutation = usePostWishlist();
  const postWishlistItemMutation = usePostWishlistItem();
  const deleteWishlistItemMutation = useDeleteWishlistItem();

  // 1. Fetch Product details
  const { data: product } = useGetProductByProductIdSuspense(productId);

  // 2. Fetch Category details (category_id is required)
  const { data: category } = useGetCategoryByCategoryIdSuspense(product.categoryId);

  // 3. Fetch Variants
  const { data: variantsData } = useGetProductVariantsSuspense({ productId });
  const variants = variantsData?.productVariants || [];

  const { userId } = useUser();

  // Extract selected variant details
  const activeVariant = variants[selectedVariantIdx] || null;
  const currentPrice = activeVariant ? activeVariant.price : 0;
  const currentComparePrice = activeVariant ? activeVariant.comparePrice : 0;
  const currentStock = activeVariant ? activeVariant.stock : 0;
  const currentSku = activeVariant ? activeVariant.sku : "";

  // Combine product image and variant images into a unified gallery list
  const baseImages = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : [product.thumbnailUrl || ""];

  const variantImages = variants
    .map((v) => v.thumbnailUrl)
    .filter((url): url is string => Boolean(url));

  const allImages = Array.from(new Set([...baseImages, ...variantImages])).filter(Boolean);



  const handleAddToCart = async () => {
    if (!userId) {
      enqueueSnackbar("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        variant: "warning",
      });
      return;
    }

    if (!activeVariant) {
      enqueueSnackbar("Vui lòng chọn mẫu sản phẩm!", { variant: "warning" });
      return;
    }

    try {
      let cartId: string;
      try {
        const cart = await queryClient.fetchQuery({
          queryKey: getGetCartQueryKey({ userId }),
          queryFn: () => getCart({ userId }),
        });
        cartId = cart.cartId;
      } catch (error: any) {
        const status = error?.response?.status || error?.status;
        if (status === STATUS_NOT_FOUND || String(error).includes("404")) {
          const newCart = await postCartMutation.mutateAsync({ data: { userId } });
          cartId = newCart.cartId;
          queryClient.setQueryData(getGetCartQueryKey({ userId }), newCart);
        } else {
          throw error;
        }
      }

      await postCartItemMutation.mutateAsync({
        cartId,
        data: {
          productVariantId: activeVariant.productVariantId,
          quantity: 1,
        },
      });

      enqueueSnackbar("Sản phẩm đã được thêm vào giỏ hàng thành công!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (error) {
      console.error("Cart error:", error);
      enqueueSnackbar("Không thể thêm vào giỏ hàng. Vui lòng thử lại!", {
        variant: "error",
      });
    }
  };

  const handleAddToWishlist = async (isFav: boolean, wishlistItems: any[]) => {
    if (!userId) {
      enqueueSnackbar("Vui lòng đăng nhập để lưu sản phẩm yêu thích!", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await queryClient.fetchQuery({
        queryKey: getGetWishlistsQueryKey({ userId }),
        queryFn: () => getWishlists({ userId }),
      });
      const wishlists = res.wishlists || [];
      let currentWishlistId: string;

      if (wishlists.length > 0) {
        currentWishlistId = wishlists[0].wishlistId;
      } else {
        const newWl = await postWishlistMutation.mutateAsync({ data: { userId } });
        currentWishlistId = newWl.wishlistId;
        queryClient.setQueryData(getGetWishlistsQueryKey({ userId }), { wishlists: [newWl] });
      }

      if (isFav) {
        const item = wishlistItems?.find((i) => i.productId === productId);
        if (item) {
          await deleteWishlistItemMutation.mutateAsync({
            wishlistId: currentWishlistId,
            wishlistItemId: item.wishlistItemId,
          });
          enqueueSnackbar("Đã xóa sản phẩm khỏi danh sách yêu thích!", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        }
      } else {
        await postWishlistItemMutation.mutateAsync({
          wishlistId: currentWishlistId,
          data: { productId },
        });
        enqueueSnackbar("Đã thêm sản phẩm vào danh sách yêu thích thành công!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }

      // Invalidate queries to trigger suspense updates
      await queryClient.invalidateQueries({
        queryKey: getGetWishlistItemsQueryKey(currentWishlistId),
      });
    } catch (error) {
      console.error("Wishlist error:", error);
      enqueueSnackbar("Có lỗi xảy ra. Vui lòng thử lại!", {
        variant: "error",
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs / Back Link */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Link
          href="/product"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <KeyboardBackspaceIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography
            variant="regularS"
            color="text.secondary"
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            Quay lại cửa hàng
          </Typography>
        </Link>
      </Stack>

      <Grid container spacing={5}>
        {/* Left Column: Image Gallery (Carousel) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductGallery
            allImages={allImages}
            productName={product.productName}
            activeImageIdx={activeImageIdx}
            setActiveImageIdx={setActiveImageIdx}
          />
        </Grid>

        {/* Right Column: Main Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Badges & Titles */}
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip
                  label={category?.categoryName || "Danh mục"}
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start", fontWeight: 700, px: 1 }}
                />
                {product.brandId && (
                  <React.Suspense fallback={null}>
                    <BrandChip brandId={product.brandId} />
                  </React.Suspense>
                )}
              </Stack>

              <Typography
                variant="title"
                sx={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {product.productName}
              </Typography>

              {currentSku && (
                <Typography variant="regularXs" color="text.secondary">
                  SKU: <strong style={{ color: "#151426" }}>{currentSku}</strong>
                </Typography>
              )}
            </Stack>

            <Divider />

            {/* Price section */}
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="baseline" spacing={2}>
                <Typography
                  variant="boldL"
                  sx={{ fontSize: "36px", color: "primary.main", fontWeight: 800 }}
                >
                  {formatPrice(currentPrice)}
                </Typography>

                {currentComparePrice > currentPrice && (
                  <Typography
                    variant="regularS"
                    sx={{ textDecoration: "line-through", color: "text.secondary" }}
                  >
                    {formatPrice(currentComparePrice)}
                  </Typography>
                )}
              </Stack>

              <Typography variant="regularXs" color="text.secondary">
                {currentStock > 0 ? (
                  <span>
                    Trạng thái: <strong style={{ color: "#22C55E" }}>Còn {currentStock} sản phẩm</strong>
                  </span>
                ) : (
                  <span>
                    Trạng thái: <strong style={{ color: "#EF4444" }}>Hết hàng tạm thời</strong>
                  </span>
                )}
              </Typography>
            </Stack>

            {/* Variant Selector */}
            {variants.length > 1 && (
              <Stack spacing={1.5}>
                <Typography variant="boldS" sx={{ color: "text.primary" }}>
                  Mẫu sản phẩm:
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
                  {variants.map((v, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    const attrLabel = v.variantAttributes
                      ? v.variantAttributes
                          .map((a) => `${a.attributeName}: ${a.attributeValue}`)
                          .join(", ")
                      : `Mẫu #${idx + 1}`;

                    return (
                      <Box
                        key={v.productVariantId}
                        onClick={() => {
                          setSelectedVariantIdx(idx);
                          if (v.thumbnailUrl) {
                            const imgIndex = allImages.indexOf(v.thumbnailUrl);
                            if (imgIndex !== -1) {
                              setActiveImageIdx(imgIndex);
                            }
                          }
                        }}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2.5,
                          border: "1.5px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected ? "rgba(129, 140, 248, 0.05)" : "background.paper",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          boxShadow: isSelected ? "0 2px 8px rgba(129, 140, 248, 0.1)" : "none",
                          "&:hover": {
                            borderColor: isSelected ? "primary.main" : "primary.light",
                          },
                        }}
                      >
                        <Typography
                          variant="boldS"
                          color={isSelected ? "primary.main" : "text.primary"}
                        >
                          {attrLabel}
                        </Typography>
                        <Typography variant="regularXs" color="text.secondary" mt={0.5}>
                          {v.stock > 0 ? `Tồn: ${v.stock}` : "Hết hàng"} — {formatPrice(v.price)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} pt={1}>
              <Button
                variant="contained"
                disabled={currentStock <= 0}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  flex: 2,
                  py: 1,
                  px: 2.5,
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: 2.5,
                }}
              >
                Thêm vào giỏ hàng
              </Button>
              <FavoriteButton
                productId={productId}
                userId={userId}
                handleAddToWishlist={handleAddToWishlist}
              />
            </Stack>

            <Divider />

            {/* Assurances list */}
            <Stack spacing={2} pt={1}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ShieldIcon sx={{ color: "primary.light" }} />
                <Typography variant="regularS" color="text.primary">
                  <strong>Bảo hành chính hãng 12 tháng:</strong> Yên tâm tuyệt đối khi mua sắm.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LocalShippingIcon sx={{ color: "primary.light" }} />
                <Typography variant="regularS" color="text.primary">
                  <strong>Giao hàng miễn phí:</strong> Áp dụng cho mọi đơn hàng từ 500.000đ.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AutorenewIcon sx={{ color: "primary.light" }} />
                <Typography variant="regularS" color="text.primary">
                  <strong>Đổi trả miễn phí trong 30 ngày:</strong> Hỗ trợ tận tâm, đổi trả dễ dàng.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        {/* Bottom Part: Description */}
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <Typography variant="header" mb={3} sx={{ fontWeight: 700, display: "block" }}>
              Mô tả chi tiết sản phẩm
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {product.description ? (
              <Box
                dangerouslySetInnerHTML={{ __html: product.description }}
                sx={{
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "text.secondary",
                  "& p": { mb: 2 },
                  "& ul, & ol": { pl: 3, mb: 2 },
                }}
              />
            ) : (
              <Typography variant="regularM" color="text.secondary">
                Không có mô tả chi tiết cho sản phẩm này.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Comments & Review Section */}
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <ProductReviews productId={productId} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
