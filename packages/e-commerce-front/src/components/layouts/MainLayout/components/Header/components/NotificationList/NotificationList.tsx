import Stack from "@mui/material/Stack";
import { NotificationListProps } from "./types";
import NotificationItem from "./NotificationItem/NotificationItem";
import { NotificationStatus } from "../NotificationContent/types";
import Button from "@mui/material/Button";

const NotificationList = ({ notificationStatus }: NotificationListProps) => {
  // TODO: Fetch notifications based on status
  const notifications = [
    {
      id: "1",
      title: "New Message",
      description: "You have received a new message from John.",
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    },
    {
      id: "2",
      title: "New Message",
      description: "You have received a new message from John.",
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    },
    {
      id: "3",
      title: "New Message",
      description: "You have received a new message from John.",
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    },
    {
      id: "4",
      title: "New Message",
      description: "You have received a new message from John.",
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    },
    {
      id: "5",
      title: "New Message",
      description: "You have received a new message from John.",
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    },
    {
      id: "2",
      title: "System Update",
      description: "The system will undergo maintenance at midnight.",
      timestamp: new Date(),
      status: NotificationStatus.READ,
    },
  ].filter((notification) => notification.status === notificationStatus);

  return (
    <Stack p={1} flex={1} display={"flex"} overflow={"auto"}>
      {notificationStatus === NotificationStatus.UNREAD &&
        notifications.length > 0 && (
          <Stack direction={"row"} justifyContent={"flex-end"} mb={1}>
            <Button variant="text" size="small">
              Đánh dấu tất cả đã đọc
            </Button>
          </Stack>
        )}
      <Stack spacing={1} flex={1} overflow={"auto"}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        <Stack alignItems={"center"}>
          <Button variant="text">Xem thêm</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NotificationList;
