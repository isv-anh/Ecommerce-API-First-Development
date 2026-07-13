"use client";

import Grid from "@mui/material/Grid";

import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import { useGetUserProductsSuspense } from "@e-commerce/api-client/endpoints/product";

const ProductList = () => {
  const { data } = useGetUserProductsSuspense();
  return (
    <Grid container spacing={1.5}>
      {data.products.map((product) => (
        <Grid key={product.productId} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
