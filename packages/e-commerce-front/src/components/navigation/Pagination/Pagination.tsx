import React from "react";
import MuiPagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import type { createSearchContext } from "@/providers/SearchProvider/utils/context";

interface PaginationProps {
  context: ReturnType<typeof createSearchContext<any>>;
  totalPages: number;
}

const Pagination = ({ context, totalPages }: PaginationProps) => {
  const { params, setParam } = context.useSearch();
  const currentPage = (params.page as number) || 1;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setParam("page", value);
  };

  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        shape="rounded"
      />
    </Stack>
  );
};

export default Pagination;
