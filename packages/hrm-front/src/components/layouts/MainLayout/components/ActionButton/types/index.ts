import { SvgIconProps } from "@mui/material/SvgIcon";
import { ElementType } from "react";

export interface ActionButtonProps {
  icon: ElementType<SvgIconProps>;
  iconProps?: SvgIconProps;
  onClick: () => void;
  title: string;
  isActive?: boolean;
}
