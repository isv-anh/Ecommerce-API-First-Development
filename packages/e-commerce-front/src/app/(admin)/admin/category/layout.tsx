"use client";
import { categorySearchContext } from "@/features/admin/category/utils";
import SearchProvider from "@/providers/SearchProvider/SearchProvider";
import { getCategoriesQueryParams } from "@e-commerce/api-validation/zod/product";
import Box from "@mui/material/Box";
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack divider={<Divider />} sx={{ flex: 1, minHeight: 0 }}>
          {search}
          <Box p={2} width={"100%"}>
            {content}
          </Box>
        </Stack>
      </Paper>
    </SearchProvider>
  );
};

export default CategoryListLayout;
