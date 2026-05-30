"use client";
import { categorySearchContext } from "@/features/admin/category/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getCategoriesQueryParams } from "@e-commerce/api-validation/zod/product";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

const CategoryListLayout = ({
  search,
  content,
}: {
  search: ReactNode;
  content: ReactNode;
}) => {
  return (
    <SearchProvider
      context={categorySearchContext}
      schema={getCategoriesQueryParams}
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

export default CategoryListLayout;
