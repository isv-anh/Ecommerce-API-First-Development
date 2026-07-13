"use client";
import { useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useBreadcrumbs } from "@/components/navigation/Breadcrumbs/components/BreadcrumbsProvider/hooks";
import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import { useGetUserProductsSuspense } from "@e-commerce/api-client/endpoints/product";
import type {
  GetUserProductsParams,
} from "@e-commerce/api-client/schemas/product";

const ProductGrid = ({
  title = "Sản phẩm nổi bật",
  subtitle = "Các lựa chọn đang được cập nhật từ kho hàng và biến thể sản phẩm.",
  params,
  showViewAll = true,
}: {
  title?: string;
  subtitle?: string;
  params?: GetUserProductsParams;
  showViewAll?: boolean;
}) => {
  const { data } = useGetUserProductsSuspense(params);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Trang chủ", href: "/" }]);
  }, [setBreadcrumbs]);

  return (
    <Box
      component="section"
      sx={{ width: "100%", px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack spacing={0.75}>
          <Typography variant="title">{title}</Typography>
          <Typography
            variant="regularS"
            color="text.secondary"
            sx={{ maxWidth: 560 }}
          >
            {subtitle}
          </Typography>
        </Stack>
        {showViewAll && (
          <Button href="/product" endIcon={<ArrowForwardIcon />} sx={{ px: 0 }}>
            Xem tất cả
          </Button>
        )}
      </Stack>

      {data.products.length > 0 ? (
        <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
          {data.products.map((product) => (
            <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{
            minHeight: 220,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Inventory2OutlinedIcon color="disabled" />
          <Typography variant="regularS" color="text.secondary">
            Chưa có sản phẩm nào được hiển thị.
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default ProductGrid;
