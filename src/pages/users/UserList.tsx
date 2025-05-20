import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../../api/users-api.ts";
import AddEditUserDialog from "./AddEditUserDialog.tsx";
import type UserResponse from "../../model/user-response.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GButton from "../../common/GButton.tsx";
import { useRoles } from "../../api/roles-api.ts";
import "./users.css";

const UserList = () => {
  const { data: users = [], refetch: usersApi } = useUsers({
    refetchOnWindowFocus: false,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const { data: roles = [], isLoading: isRoleLoading } = useRoles({
    refetchOnWindowFocus: false,
  });

  const [updatedUser, setUpdatedUser] = useState<UserResponse | undefined>();

  const { isPending: isAdding, mutate: addUserApi } = useCreateUser({
    onSuccess: () => {
      usersApi();
      onClose();
    },
    onError: () => {},
  });

  const { isPending: isUpdating, mutate: updateUserApi } = useUpdateUser({
    onSuccess: () => {
      usersApi();
      onClose();
    },
    onError: () => {},
  });

  const { isPending: isDeleting, mutate: deleteUserApi } = useDeleteUser({
    onSuccess: () => {
      usersApi();
      onClose();
    },
    onError: () => {},
  });

  const handleAddUser = (user: UserResponse) => {
    addUserApi(user);
  };

  const handleEditUser = (user: UserResponse) => {
    updateUserApi(user);
  };

  const onClose = () => {
    setUpdatedUser(undefined);
    setDialogOpen(false);
  };
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add User
        </Button>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table className={"g-table"} stickyHeader aria-label="user table">
            <TableHead
              className={"g-table-header"}
              style={{ backgroundColor: "#000000" }}
            >
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Updated By</TableCell>
                <TableCell>Last Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.roles.map((role) => role.name).join(", ")}
                    </TableCell>
                    <TableCell>{user.createdBy}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.lastUpdatedBy}</TableCell>
                    <TableCell>{user.lastUpdatedAt}</TableCell>
                    <TableCell>
                      <GButton
                        size="small"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setUpdatedUser(user);
                          setDialogOpen(true);
                        }}
                        label="Edit"
                      />
                      <GButton
                        size="small"
                        color="primary"
                        startIcon={<DeleteIcon />}
                        disabled={user.roles?.some(
                          (role) => role.name.toLowerCase() == "admin",
                        )}
                        onClick={() => {
                          deleteUserApi(user.id);
                        }}
                        label="Delete"
                        loading={isDeleting}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AddEditUserDialog
        title={updatedUser ? "Edit User" : "Add User"}
        open={dialogOpen}
        onClose={onClose}
        roles={roles}
        isRoleLoading={isRoleLoading}
        onSubmit={updatedUser ? handleEditUser : handleAddUser}
        user={updatedUser}
        isLoading={isAdding || isUpdating}
      />
    </>
  );
};
export default UserList;
