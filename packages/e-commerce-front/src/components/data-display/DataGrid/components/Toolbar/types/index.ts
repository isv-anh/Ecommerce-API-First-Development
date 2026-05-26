import type { SvgIconProps } from "@mui/material";
import type { GridToolbarProps } from "@mui/x-data-grid";
import type { ElementType } from "react";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    leftButtons?: ToolbarButton[];
    rightButtons?: ToolbarButton[];
  }
}

export type ToolbarButton = {
  label: string;
  action: () => void;
  startIcon?: ElementType<SvgIconProps>;
  endIcon?: ElementType<SvgIconProps>;
};

export type ToolbarProps = GridToolbarProps & {
  leftButtons?: ToolbarButton[];
  rightButtons?: ToolbarButton[];
};
