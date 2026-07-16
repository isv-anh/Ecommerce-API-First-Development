"use client";
import ProductGrid from "@/features/main/components/ProductGrid/ProductGrid";
import ProductSearch from "@/features/main/components/ProductSearch/ProductSearch";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

import Stack from "@mui/material/Stack";

const Category = () => {
  return (
    <Stack direction={"row"} spacing={4} py={2} sx={{ width: "100%" }}>
      <Stack flex={1} spacing={2} alignItems={"center"} sx={{ width: "100%" }}>
        <Stack sx={{ width: "100%" }}>
          <Box sx={{ px: 0, mb: 1 }}>
            <ProductSearch />
          </Box>
          <ProductGrid />
        </Stack>
        <Pagination shape="rounded" variant="outlined" color="primary" />
      </Stack>
    </Stack>
  );
};

export default Category;
