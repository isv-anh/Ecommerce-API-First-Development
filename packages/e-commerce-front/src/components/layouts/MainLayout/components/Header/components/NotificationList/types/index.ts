import { NotificationStatus } from "../../NotificationContent/types";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: NotificationStatus;
}

export interface NotificationListProps {
  notificationStatus: NotificationStatus;
}
