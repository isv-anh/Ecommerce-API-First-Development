import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";

const SubmitDialog = ({
  open,
  onClose,
  onSubmit,
  onDetele,
  deleteMessage = "Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.",
  title,
  children,
  width,
  loading,
}: SubmitDialogProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);
  const handleConfirm = async () => {
    setConfirmOpen(false);
    onDetele?.();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { width, position: "relative" } }}
      >
        {/* Backdrop loading */}

        <Backdrop open={loading || false}>
          <CircularProgress size={32} />
        </Backdrop>

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          {title}
          <IconButton size="small" onClick={onClose} disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>{children}</DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
          {onDetele ? (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              disabled={loading}
            >
              Xóa
            </Button>
          ) : (
            <span />
          )}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button variant="contained" onClick={onSubmit} disabled={loading}>
              Xác nhận
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        title="Xác nhận xóa"
        message={deleteMessage}
        width={width}
      />
    </>
  );
};

export default SubmitDialog;
