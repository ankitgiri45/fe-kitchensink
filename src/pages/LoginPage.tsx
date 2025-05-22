import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useLogin, useRegisterUser } from "../api/auth-api.ts";
import { useNavigate } from "react-router-dom";
import { UI_ENDPOINTS } from "../constant/ui-endpoints.ts";
import type { LoginResponse } from "../model/login-response.ts";
import AddEditUserDialog from "./users/AddEditUserDialog";
import { useDefaultRoles } from "../api/roles-api.ts";
import logo from "/kitchen-sink-logo.webp";
import { LOGGED_IN_USER_KEY, LOGIN_TOKEN_KEY } from "../constant/constant.ts";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupOpen, setSignupOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: loginApi, isPending: loggingIn } = useLogin({
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem(LOGIN_TOKEN_KEY, data.token.current);
      data.email = email;
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(data));
      navigate(UI_ENDPOINTS.HOME, { replace: true });
    },
    onError: () => {},
  });

  const onClose = () => {
    setSignupOpen(false);
  };

  const { isPending: isAdding, mutate: registerApi } = useRegisterUser({
    onSuccess: () => {
      onClose();
    },
  });

  const { isLoading: isRolesLoading, data: roles } = useDefaultRoles({
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const token = localStorage.getItem(LOGIN_TOKEN_KEY);
    if (token) {
      navigate(UI_ENDPOINTS.HOME, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginApi({ email, password });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ padding: 4, minWidth: 500 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Box
            component="img"
            src={logo}
            alt="Kitchen Sink Logo"
            sx={{
              height: 200,
              width: 200,
              borderRadius: "50%",
              boxShadow: 3,
              backgroundColor: "#fff",
              p: 1,
              objectFit: "contain",
            }}
          />
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loggingIn}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loggingIn}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            loading={loggingIn}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Box mt={3} textAlign="center">
          <Typography variant="body2">Don't have an account?</Typography>
          <Button
            variant="text"
            onClick={() => setSignupOpen(true)}
            disabled={loggingIn || isRolesLoading}
            loading={isRolesLoading}
          >
            Sign Up
          </Button>
        </Box>
        <AddEditUserDialog
          title={"Sign Up"}
          open={signupOpen}
          onClose={onClose}
          roles={roles ?? []}
          isRoleLoading={false}
          isLoading={isAdding}
          onSubmit={registerApi}
        />
      </Paper>
    </Box>
  );
};
export default LoginPage;
