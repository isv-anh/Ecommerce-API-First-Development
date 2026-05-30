import type { GridToolbarProps } from "@mui/x-data-grid";
import type { ReactNode } from "react";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    leftButtons?: ToolbarButton[];
    rightButtons?: ToolbarButton[];
  }
}

export type ToolbarButton = {
  label: string;
  action: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export type ToolbarProps = GridToolbarProps & {
  leftButtons?: ToolbarButton[];
  rightButtons?: ToolbarButton[];
};
