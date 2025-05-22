import {
  CircularProgress,
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
import DeleteConfirmationDialog from "../../common/DeleteConfirmationDialog.tsx";

const UserList = () => {
  const {
    data: users = [],
    refetch: usersApi,
    isFetching: isUsersLoading,
  } = useUsers({
    refetchOnWindowFocus: false,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
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

  const getOnSuccess = () => {
    if (!isUsersLoading) {
      usersApi();
    }
    onClose();
    onDeleteDialogClose();
  };

  const { isPending: isAdding, mutate: addUserApi } = useCreateUser({
    onSuccess: getOnSuccess,
    onError: () => {},
  });
  const { isPending: isUpdating, mutate: updateUserApi } = useUpdateUser({
    onSuccess: getOnSuccess,
    onError: () => {},
  });
  const { isPending: isDeleting, mutate: deleteUserApi } = useDeleteUser({
    onSuccess: getOnSuccess,
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

  const onDeleteDialogClose = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete && !isDeleting) {
      deleteUserApi(userToDelete.id);
    }
  };

  const openDeleteDialog = (user: UserResponse) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <GButton
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          loading={isAdding}
          label="Add User"
        />
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
              {isUsersLoading ? (
                <TableRow>
                  <TableCell>
                    <CircularProgress size={60} />
                  </TableCell>
                </TableRow>
              ) : (
                users
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
                          loading={isUpdating}
                          label="Edit"
                        />
                        <GButton
                          size="small"
                          color="primary"
                          startIcon={<DeleteIcon />}
                          disabled={user.roles?.some(
                            (role) => role.name.toLowerCase() == "admin",
                          )}
                          onClick={() => openDeleteDialog(user)}
                          label="Delete"
                          loading={isDeleting}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
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
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Confirm User Deletion"
        content={
          <div>
            <span>Are you sure you want to delete user </span>
            <span className={"g-text-bold"} style={{ color: "#000000" }}>
              {userToDelete?.firstName} {userToDelete?.lastName}
            </span>
            <span>? This action cannot be undone.</span>
          </div>
        }
      />
    </>
  );
};
export default UserList;
