"use client";
import { useListProductsSuspense } from "@/generated/endpoints/petstore/petstore";
import Grid from "@mui/material/Grid";
import ProductCard from "../ProductCard/ProductCard";

const ProductList = () => {
  const { data } = useListProductsSuspense();
  return (
    <Grid container spacing={1.5}>
      {data.data.products.map((product) => (
        <Grid key={product.product_id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
