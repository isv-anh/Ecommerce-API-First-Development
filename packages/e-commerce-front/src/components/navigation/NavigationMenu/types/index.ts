export interface AppItem {
  appId: string;
  appName: string;
  appIcon?: string;
  url?: string;
  children: AppItem[];
}

export interface NavigationMenuProps {
  appItems: AppItem[];
}
