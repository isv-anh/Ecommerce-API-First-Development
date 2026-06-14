import type { ButtonOwnProps } from "@mui/material/Button";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  width?: number | string;
  confirmButtonTitle?: string;
  confirmButtonVariant?: ButtonOwnProps["variant"];
  confirmButtonColor?: ButtonOwnProps["color"];
};
