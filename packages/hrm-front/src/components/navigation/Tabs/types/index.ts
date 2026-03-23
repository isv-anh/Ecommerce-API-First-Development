import { TabsProps as MuiTabsProps } from "@mui/material/Tabs";

export interface TabItem {
  label: string;
  value: string;
  badgeCount?: number;
}

export interface TabsProps extends MuiTabsProps {
  items: TabItem[];
}
