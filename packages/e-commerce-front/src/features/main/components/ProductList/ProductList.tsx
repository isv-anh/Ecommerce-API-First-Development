"use client";

import Grid from "@mui/material/Grid";

import ProductCard from "@/features/main/components/ProductCard/ProductCard";
import { customInstance } from "@e-commerce/api-client/mutator/custom-instance";
import type { ProductsResponse } from "@e-commerce/api-client/schemas/product";
import { useSuspenseQuery } from "@tanstack/react-query";

const ProductList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["/api/v1/user/products"],
    queryFn: () =>
      customInstance<ProductsResponse>({
        url: "/api/v1/user/products",
        method: "GET",
      }),
  });
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
