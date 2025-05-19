import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import {useLogin, useRegisterUser} from "../api/auth-api.ts";
import {useNavigate} from "react-router-dom";
import {UI_ENDPOINTS} from "../constant/ui-endpoints.ts";
import type {LoginResponse} from "../model/login-response.ts";
import AddEditUserDialog from './users/AddEditUserDialog';

const LoginPage: React.FC = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [signupOpen, setSignupOpen] = useState(false);
        const navigate = useNavigate();
        const {mutate: loginApi, isPending: loggingIn} = useLogin({
            onSuccess: (data: LoginResponse) => {
                localStorage.setItem("token", data.token);
                data.email = email;
                localStorage.setItem("currentUser", JSON.stringify(data));
                navigate(UI_ENDPOINTS.HOME, {replace: true});
            }, onError: () => {
            }
        });
        const onClose = () => {
            setSignupOpen(false);
        };
        const {isPending: isAdding, mutate: registerApi} = useRegisterUser({
            onSuccess: () => {
                onClose();
            }
        });

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                navigate(UI_ENDPOINTS.HOME);
            }
        }, [navigate]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            loginApi({email, password});
        };

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Paper elevation={3} sx={{padding: 4, minWidth: 320}}>
                    <Typography variant="h5" mb={2} align="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loggingIn}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loggingIn}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            loading={loggingIn}
                            sx={{mt: 2}}
                        >
                            Login
                        </Button>
                    </form>
                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">Don't have an account?</Typography>
                        <Button variant="text" onClick={() => setSignupOpen(true)} disabled={loggingIn}>
                            Sign Up
                        </Button>
                    </Box>
                    <AddEditUserDialog
                        title={"Sign Up"}
                        open={signupOpen}
                        onClose={onClose}
                        roles={[{
                            id: "6828eb8fcba512b0d1307575",
                            name: "USER",
                            allowedUrls: [
                                "/users/me",
                                "/perform-logout"
                            ]
                        }]}
                        isRoleLoading={false}
                        isLoading={isAdding}
                        onSubmit={registerApi}
                    />
                </Paper>
            </Box>
        );
    }
;

export default LoginPage;
