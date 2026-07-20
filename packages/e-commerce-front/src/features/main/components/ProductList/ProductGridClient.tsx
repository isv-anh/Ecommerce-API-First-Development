"use client";

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import { useGetUserProductsSuspense } from "@e-commerce/api-client/endpoints/product";
import { userProductSearchContext } from "@/features/main/product/utils";

const ProductGridClient = () => {
  const { params, setParams } = userProductSearchContext.useSearch();
  const { data } = useGetUserProductsSuspense(params);

  // Accumulate products for "Load More" functionality
  const [accumulatedProducts, setAccumulatedProducts] = useState(data.products);
  const [prevDataProducts, setPrevDataProducts] = useState(data.products);

  if (data.products !== prevDataProducts) {
    setPrevDataProducts(data.products);
    if (!params.page || params.page === 1) {
      setAccumulatedProducts(data.products);
    } else {
      setAccumulatedProducts((prev) => {
        const newProducts = data.products.filter(
          (p) => !prev.some((existing) => existing.productId === p.productId),
        );
        return [...prev, ...newProducts];
      });
    }
  }

  return (
    <Stack spacing={3} width="100%">
      {/* Kết quả đếm số lượng */}
      <Typography variant="regularS" color="text.secondary">
        {data.totalCount > 0
          ? `Hiển thị 1 - ${accumulatedProducts.length} / ${data.totalCount} sản phẩm`
          : "Không có sản phẩm nào"}
      </Typography>

      {/* Grid danh sách sản phẩm chiếm trọn 12 cột */}
      {accumulatedProducts.length > 0 ? (
        <Grid container spacing={2}>
          {accumulatedProducts.map((product) => (
            <Grid
              key={product.productId}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          py={10}
          spacing={1.5}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="boldM" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="regularS" color="text.secondary">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </Typography>
        </Stack>
      )}

      {/* Nút Xem thêm */}
      {(params.page || 1) < data.totalPages && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setParams({ page: (params.page || 1) + 1 })}
            sx={{
              borderRadius: 8,
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Xem thêm
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default ProductGridClient;
