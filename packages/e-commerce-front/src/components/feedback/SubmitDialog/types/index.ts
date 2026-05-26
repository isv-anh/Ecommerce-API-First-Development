import type { ReactNode } from "react";

export type SubmitDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDetele?: () => void;
  title: string;
  children: ReactNode;
};
