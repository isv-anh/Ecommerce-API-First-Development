import { TabItem } from "@/components/navigation/Tabs/types";
import { NotificationStatus } from "../types";

export const tabItems: TabItem[] = [
  {
    label: "Chưa đọc",
    value: NotificationStatus.UNREAD,
    badgeCount: 5,
  },
  {
    label: "Đã đọc",
    value: NotificationStatus.READ,
  },
];
