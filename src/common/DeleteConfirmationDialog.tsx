import { Button, DialogContentText } from "@mui/material";
import React from "react";
import GDialog from "./GDialog.tsx";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title?: string;
  content?: React.ReactNode;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  title = "Confirm Deletion",
  content = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  return (
    <GDialog
      open={open}
      onClose={onClose}
      size="xs"
      title={title}
      dialogContent={
        <DialogContentText id="delete-confirmation-dialog-description">
          {content}
        </DialogContentText>
      }
      dialogActions={
        <>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </>
      }
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
    />
  );
};

export default DeleteConfirmationDialog;
