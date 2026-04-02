import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NotificationItemProps } from "./types";
import { format } from "date-fns";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { NotificationStatus } from "../../NotificationContent/types";

const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <Paper
      elevation={3}
      component={Button}
      onClick={() => console.log("parent")}
    >
      <Stack alignItems={"flex-start"}>
        <Typography variant="subtitle">{notification.title}</Typography>
        <Typography>{notification.description}</Typography>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="regularXs">
            {format(notification.timestamp, "yyyy-MM-dd HH:mm")}
          </Typography>
          {notification.status === NotificationStatus.UNREAD && (
            <Button
              variant="text"
              size="small"
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                console.log("mark as read");
              }}
            >
              Mark as read
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NotificationItem;
