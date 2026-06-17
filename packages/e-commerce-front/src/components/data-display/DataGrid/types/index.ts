import type {
  GridPaginationModel,
  DataGridProps as MuiDataGridProps,
} from "@mui/x-data-grid";

export type DataGridProps = MuiDataGridProps & {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  paginationModelChange?: (model: GridPaginationModel) => void;
  orderByChange?: (orderBy: string) => void;
};
