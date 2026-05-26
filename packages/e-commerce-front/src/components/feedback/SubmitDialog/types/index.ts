import type { ReactNode } from "react";

export type SubmitDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDetele?: () => void;
  deleteMessage?: string;
  title: string;
  children: ReactNode;
  width?: number | string;
  loading?: boolean;
};
