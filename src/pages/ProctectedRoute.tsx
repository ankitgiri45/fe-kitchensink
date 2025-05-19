import React, {useMemo} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {UI_ENDPOINTS} from "../constant/ui-endpoints.ts";

const ProtectedRoute: React.FC<{ children: React.JSX.Element }> = ({children}) => {
    const navigate = useNavigate();

    const loggedIn = useMemo(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            localStorage.clear();
            return false;
        }
        return true;
    }, [navigate]);
    return loggedIn ? children : <Navigate to={UI_ENDPOINTS.LOGIN} replace/>;
};

export default ProtectedRoute;