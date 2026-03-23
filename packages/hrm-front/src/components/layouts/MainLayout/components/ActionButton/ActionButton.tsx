import IconButton from "@mui/material/IconButton";
import { ActionButtonProps } from "./types";
import Tooltip from "@mui/material/Tooltip";

const ActionButton = ({
  icon: Icon,
  iconProps,
  onClick,
  title,
  isActive = false,
}: ActionButtonProps) => {
  return (
    <Tooltip title={title} placement="right">
      <IconButton
        size="large"
        onClick={onClick}
        aria-label={title}
        color={isActive ? "primary" : "default"}
        data-active={isActive ? "true" : "false"}
      >
        <Icon {...iconProps} />
      </IconButton>
    </Tooltip>
  );
};

export default ActionButton;
