import './App.css'
import LoginPage from './pages/LoginPage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Alert, Snackbar} from "@mui/material";
import {clearError, clearSuccess, type RootState} from './store/root-store';
import {useDispatch, useSelector} from "react-redux";
import HomePage from "./pages/HomePage.tsx";
import ProtectedRoute from "./pages/ProctectedRoute.tsx";
import {UI_ENDPOINTS} from "./constant/ui-endpoints.ts";
import NotFoundPage from "./pages/NotFound.tsx";
import type {ReactNode} from 'react';

function App() {
    const dispatch = useDispatch();
    const errorMessage = useSelector((state: RootState) => state.error);
    const successMessage = useSelector((state: RootState) => state.success);

    const renderErrorContent = (data: unknown): ReactNode => {
        if (Array.isArray(data)) {
            return data.map((item, i) => (
                <div key={`error-${i}-${typeof item}`}>
                    {typeof item === 'object' && item !== null
                        ? JSON.stringify(item, null, 2)
                        : String(item)}
                </div>
            ));
        }
        if (typeof data === 'object' && data !== null) {
            return JSON.stringify(data, null, 2);
        }
        return String(data);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={() => dispatch(clearError())}
                autoHideDuration={3000}
                open={!!errorMessage}
                key={errorMessage?.status}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{maxWidth: '50%'}}
                >
                    <div>{errorMessage?.message}</div>
                    <div>{renderErrorContent(errorMessage?.data)}</div>
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                autoHideDuration={3000}
                onClose={() => dispatch(clearSuccess())}
                open={!!successMessage}
                key={successMessage?.status}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{maxWidth: '50%'}}
                >
                    {successMessage?.message}
                </Alert>
            </Snackbar>
            <Router>
                <Routes>
                    <Route path={UI_ENDPOINTS.LOGIN} element={<LoginPage/>}/>
                    <Route path={UI_ENDPOINTS.HOME} element={<ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App

