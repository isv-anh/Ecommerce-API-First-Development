"use client";
import Grid from "@mui/material/Grid";
import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import { useGetProductsSuspense } from "@e-commerce/api-client/endpoints/product/product";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useBreadcrumbs } from "@/components/navigation/Breadcrumbs/components/BreadcrumbsProvider/hooks";
import { useEffect } from "react";

const ProductGrid = ({ title }: { title?: string }) => {
  const { data } = useGetProductsSuspense();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Trang chủ", href: "/" }]);
  }, [setBreadcrumbs, title]);

  return (
    <Box component="section" sx={{ width: "100%", px: 6 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        {title && <Typography variant="header">{title}</Typography>}
      </Stack>

      <Grid container spacing={2}>
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {data?.products?.map((product) => (
          <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
