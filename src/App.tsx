import './App.css'
import LoginPage from './pages/LoginPage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Snackbar} from "@mui/material";
import {clearError, type RootState} from './store/root-store';
import {useDispatch, useSelector} from "react-redux";
import HomePage from "./pages/HomePage.tsx";
import ProtectedRoute from "./pages/ProctectedRoute.tsx";
import {UI_ENDPOINTS} from "./constant/ui-endpoints.ts";
import NotFoundPage from "./pages/NotFound.tsx";

function App() {
    const dispatch = useDispatch();
    const errorMessage = useSelector((state: RootState) => state.error);
    const successMessage = useSelector((state: RootState) => state.success);

    return (
        <div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                autoHideDuration={5000}
                onClose={() => dispatch(clearError())}
                open={!!errorMessage}
                message={errorMessage?.message}
                key={errorMessage?.status}
            />
            <Router>
                <Routes>
                    <Route path={UI_ENDPOINTS.LOGIN} element={<LoginPage/>}/>
                    <Route path={UI_ENDPOINTS.DASHBOARD} element={<ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App

