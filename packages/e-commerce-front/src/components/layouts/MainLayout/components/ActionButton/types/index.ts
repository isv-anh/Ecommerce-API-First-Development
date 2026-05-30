import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ElementType } from "react";

export interface ActionButtonProps {
  icon: ElementType<SvgIconProps>;
  iconProps?: SvgIconProps;
  onClick: () => void;
  title: string;
  isActive?: boolean;
}
