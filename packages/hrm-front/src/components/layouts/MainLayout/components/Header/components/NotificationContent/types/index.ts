export interface NotificationContentProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  open: boolean;
}

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
}
