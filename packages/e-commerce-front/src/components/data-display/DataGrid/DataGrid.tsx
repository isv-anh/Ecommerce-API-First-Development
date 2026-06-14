import Toolbar from "@/components/data-display/DataGrid/components/Toolbar/Toolbar";
import type { DataGridProps } from "@/components/data-display/DataGrid/types";
import { parseSortModel } from "@/utils/parseSortModel";
import type { GridSortModel } from "@mui/x-data-grid";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";

const DataGrid = ({
  page,
  pageSize,
  orderBy,
  paginationModelChange,
  orderByChange,
  rows,
  ...props
}: DataGridProps) => {
  const paginationModel = useMemo(
    () => ({ page: page - 1, pageSize }),
    [page, pageSize],
  );

  const sortModel = useMemo(() => parseSortModel(orderBy), [orderBy]);

  const handlePaginationChange = useCallback(
    (model: { page: number; pageSize: number }) => {
      if (model.page === page - 1 && model.pageSize === pageSize) return;
      paginationModelChange({ page: model.page, pageSize: model.pageSize });
    },
    [page, pageSize, paginationModelChange],
  );

  const handleSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      const sortString = sortModel.map((s) => `${s.field}:${s.sort}`).join(",");
      orderByChange(sortString);
    },
    [orderByChange],
  );

  return (
    <MuiDataGrid
      slots={{
        toolbar: Toolbar,
      }}
      showToolbar
      paginationMode="server"
      sortingMode="server"
      sx={{
        flex: 1,
        minHeight: 0,
        borderRadius: 2,
        "& .MuiDataGrid-footerContainer": {
          height: 50,
          minHeight: 50,
        },
        "& .MuiTablePagination-toolbar": {
          height: 50,
          minHeight: "50px !important",
          padding: "0 8px",
        },
      }}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      pageSizeOptions={[10, 20, 50, 100]}
      rows={rows}
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      {...props}
    />
  );
};

export default DataGrid;
