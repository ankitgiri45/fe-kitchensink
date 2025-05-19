import React, { useEffect } from "react";
import {
  Box,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type UserResponse from "../../model/user-response.ts";
import GDialog from "../../common/GDialog.tsx";
import GButton from "../../common/GButton.tsx";
import type { RoleResponse } from "../../model/role-response.ts";

interface AddUserDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  isLoading: boolean;
  user?: UserResponse;
  onSubmit: (user: UserResponse) => void;
  roles: RoleResponse[];
  isRoleLoading?: boolean;
}

interface FormDataType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
  password: string;
}

const AddEditUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  isLoading,
  user,
  roles,
  isRoleLoading,
}) => {
  const isEditing = !!user;
  const defaultValues = {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roles: [],
    password: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormDataType>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (user) {
      setValue("id", user.id);
      setValue("email", user.email);
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("phone", user.phone);
      setValue(
        "roles",
        user.roles.map((role) => role.id),
      );
      setValue("password", "");
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open]);

  return (
    <GDialog
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      dialogContent={
        <form
          onSubmit={handleSubmit((data) => {
            const userData = {
              ...data,
              roles: data.roles
                .map((roleId) => ({
                  ...(roles.find((role) => role.id === roleId) as RoleResponse),
                }))
                .filter((role) => !!role && Object.keys(role).length > 0),
            };
            onSubmit(userData); // Only parent controls closing
          })}
        >
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    disabled={isEditing || isLoading}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    onBlur={async () => {
                      field.onBlur(); // Trigger react-hook-form's blur handler
                      // Trigger validation manually for this field
                      await trigger("email");
                    }}
                  />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      disabled={isLoading}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      disabled={isLoading}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      fullWidth
                    />
                  )}
                />
              </Stack>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^\+?\d{7,15}$/,
                    message: "Invalid phone",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    disabled={isLoading}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                    onBlur={async () => {
                      field.onBlur(); // Trigger react-hook-form's blur handler
                      // Trigger validation manually for this field
                      await trigger("phone");
                    }}
                  />
                )}
              />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Controller
                    name="roles"
                    control={control}
                    rules={{
                      required: "Role is required",
                      validate: (roles) =>
                        (roles && roles.length > 0) ||
                        "At least one role required",
                    }}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Role"
                        disabled={isLoading}
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={
                          isRoleLoading ? "Loading..." : "Select a role"
                        }
                        error={!!errors.roles}
                        helperText={errors.roles?.message}
                        fullWidth
                        onBlur={async () => {
                          field.onBlur(); // Trigger react-hook-form's blur handler
                          // Trigger validation manually for this field
                          await trigger("roles");
                        }}
                        slotProps={{ select: { multiple: true } }}
                      >
                        {!isRoleLoading &&
                          roles?.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                      </TextField>
                    )}
                  />
                </Stack>
              </Box>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    disabled={isLoading}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    onBlur={async () => {
                      field.onBlur(); // Trigger react-hook-form's blur handler
                      // Trigger validation manually for this field
                      await trigger("password");
                    }}
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <GButton
              onClick={onClose}
              color="secondary"
              variant="outlined"
              label="Cancel"
            />
            <GButton
              type="submit"
              color="primary"
              variant="contained"
              loading={isLoading}
              label={title}
            />
          </DialogActions>
        </form>
      }
    />
  );
};

export default AddEditUserDialog;
