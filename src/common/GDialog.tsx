import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  dialogContent: React.ReactNode;
  dialogActions?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const GDialog: React.FC<Props> = ({
  title,
  open,
  onClose,
  dialogContent,
  dialogActions,
  size,
}) => {
  return (
    <Dialog
      className={"g-dialog"}
      open={open}
      onClose={onClose}
      maxWidth={size}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};

export default GDialog;
