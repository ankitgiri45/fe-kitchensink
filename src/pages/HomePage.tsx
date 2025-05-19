import React, { useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { UI_ENDPOINTS } from "../constant/ui-endpoints.ts";
import UserList from "./users/UserList.tsx";
import type { LoginResponse } from "../model/login-response.ts";
import { useLogout } from "../api/auth-api.ts";

const UserView: React.FC<{ currentUser: LoginResponse }> = ({
  currentUser,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        textAlign: "center",
        py: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {currentUser.email}!
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        You're currently at role. {currentUser.roles.join(", ")}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Your personalized dashboard is currently under development
      </Typography>
      <CircularProgress size={60} />
    </Box>
  );
};

const HomePage = () => {
  const currentUser: LoginResponse = JSON.parse(
    localStorage.getItem("currentUser") ?? "{}",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const onSuccess = () => {
    localStorage.clear();
    navigate(UI_ENDPOINTS.LOGIN, { replace: true });
  };
  const { isPending: loggingOut, mutate: logoutApi } = useLogout({
    onSuccess: onSuccess,
    onError: onSuccess,
  });
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleLogout = () => {
    logoutApi();
  };

  const drawer = (
    <List>
      <ListItem>
        <ListItemIcon>
          <EmailIcon />
        </ListItemIcon>
        <ListItemText primary={currentUser.email} />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary={currentUser.roles} />
      </ListItem>
      <ListItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Container sx={{ mt: 4 }} style={{ maxWidth: "100%" }}>
        {currentUser.roles.some((role) => role.toLowerCase() === "admin") ? (
          <UserList />
        ) : (
          <UserView currentUser={currentUser} />
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
