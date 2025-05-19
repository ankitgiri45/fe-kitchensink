import React from "react";
import { Button } from "@mui/material";

interface Props {
  onClick?: () => void;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  type?: "button" | "submit" | "reset";
  variant?: "text" | "outlined" | "contained";
  loading?: boolean;
  label: string;
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  disabled?: boolean;
}

const GButton: React.FC<Props> = ({
  onClick,
  color,
  type,
  variant,
  loading,
  label,
  size,
  startIcon,
  disabled,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      color={color}
      variant={variant}
      className={`g-button`}
      loading={loading}
      size={size}
      startIcon={startIcon}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default GButton;
