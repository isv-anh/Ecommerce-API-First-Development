import type {
  ToolbarButton,
  ToolbarProps,
} from "@/components/data-display/DataGrid/components/Toolbar/types";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ColumnsPanelTrigger } from "@mui/x-data-grid";
import { Toolbar as MuiToolbar } from "@mui/x-data-grid";
import { useCallback } from "react";

const Toolbar = ({ leftButtons, rightButtons, ...props }: ToolbarProps) => {
  const renderButton = useCallback((buttons: ToolbarButton[]) => {
    return (
      <Stack direction={"row"} spacing={2}>
        {buttons?.map((button, index) => {
          return (
            <Button
              variant="contained"
              startIcon={button.startIcon}
              endIcon={button.endIcon}
              key={index}
              onClick={button.action}
            >
              {button.label}
            </Button>
          );
        })}
      </Stack>
    );
  }, []);

  return (
    <MuiToolbar {...props}>
      <ColumnsPanelTrigger
        render={(triggerProps) => (
          <Button {...triggerProps} variant="contained">
            Ẩn/hiện cột
          </Button>
        )}
      />
      <Box ml={1}></Box>
      {leftButtons && renderButton(leftButtons)}
      <Box flexGrow={1}></Box>
      {rightButtons && renderButton(rightButtons)}
    </MuiToolbar>
  );
};

export default Toolbar;
