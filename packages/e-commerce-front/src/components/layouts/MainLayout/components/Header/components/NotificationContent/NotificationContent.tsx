import Popover from "@mui/material/Popover";
import { NotificationContentProps, NotificationStatus } from "./types";

import { useState } from "react";
import { tabItems } from "./constants/tabItem";
import Tabs from "@/components/navigation/Tabs/Tabs";
import NotificationList from "../NotificationList/NotificationList";
import Divider from "@mui/material/Divider";

const NotificationContent = ({
  anchorEl,
  onClose,
  open,
}: NotificationContentProps) => {
  const id = open ? "simple-popover" : undefined;

  const [tabValue, setTabValue] = useState(tabItems[0].value);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        "& .MuiPaper-root": {
          p: 1,
          maxHeight: 600,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleChange}
        items={tabItems}
        aria-label="notification-tabs"
      />
      <Divider />

      <NotificationList notificationStatus={tabValue as NotificationStatus} />
    </Popover>
  );
};

export default NotificationContent;
