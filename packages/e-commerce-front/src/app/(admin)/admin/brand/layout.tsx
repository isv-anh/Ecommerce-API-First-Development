"use client";
import { brandSearchContext } from "@/features/admin/brand/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getBrandsQueryParams } from "@e-commerce/api-validation/zod/product";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

const BrandListLayout = ({
  search,
  content,
}: {
  search: ReactNode;
  content: ReactNode;
}) => {
  return (
    <SearchProvider
      context={brandSearchContext}
      schema={getBrandsQueryParams}
    >
      <Paper
        sx={{
          height: "calc(100vh - 105px)",
        }}
      >
        <Stack divider={<Divider />}>
          {search}
          <Stack p={2}>{content}</Stack>
        </Stack>
      </Paper>
    </SearchProvider>
  );
};

export default BrandListLayout;