import { App } from "@/generated/schemas/system";
import { AppItem } from "../types";

export const mapToAppItem = (apps: App[]): AppItem[] => {
  const appMap = new Map<number | null, AppItem[]>();

  apps.forEach((app) => {
    const parentId = app.parent_app_id ?? null;

    const item: AppItem = {
      appId: app.app_id.toString(),
      appName: app.app_name,
      appIcon: app.icon,
      children: [],
    };

    if (!appMap.has(parentId)) {
      appMap.set(parentId, []);
    }

    appMap.get(parentId)!.push(item);
  });

  const buildTree = (parentId: number | null): AppItem[] => {
    return (appMap.get(parentId) || []).map((item) => ({
      ...item,
      children: buildTree(Number(item.appId)),
    }));
  };

  return buildTree(null);
};
