import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import Button from "@mui/material/Button";
import { useState } from "react";
import NotificationContent from "../NotificationContent/NotificationContent";

const NotificationButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="text"
        startIcon={<NotificationsRoundedIcon />}
        size="small"
        onClick={handleClick}
      >
        Thông báo
      </Button>
      <NotificationContent
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
      />
    </>
  );
};

export default NotificationButton;
