import axios, {AxiosError, type AxiosError as AxiosErrorType, type AxiosResponse} from 'axios';
import type ApiResponse from "../model/api-response.ts";
import store, {setError, setSuccess} from "../store/root-store.ts";
import {UI_ENDPOINTS} from "../constant/ui-endpoints.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
const noTokenRequired = ["/login", "/register"];

// Add this before exporting api
api.interceptors.request.use(
    (config) => {
        if (!noTokenRequired.includes(config.url ?? '')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                localStorage.clear();
                window.location.replace(UI_ENDPOINTS.LOGIN);
            }
        }
        return config;
    }
);
// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        store.dispatch(setSuccess(response.data));
        return response;
    },
    (error: AxiosErrorType<ApiResponse<unknown>>) => {
        console.error('Error:', error);
        let data: ApiResponse<unknown>;
        if (error.code === AxiosError.ERR_NETWORK || error.code === AxiosError.ERR_CANCELED) {
            data = {
                status: 500,
                message: error.message,
                data: null,
            };
            store.dispatch(setError(data));
        } else if (error.status === 403) {
            console.error('Unauthorized');
            data = {
                status: 403,
                message: "You are not authorized to access this resource",
                data: null,
            }
            //TODO localStorage.clear();
            // window.location.replace(UI_ENDPOINTS.LOGIN);
        } else {
            data = error.response?.data as ApiResponse<unknown>;
        }
        store.dispatch(setError(data));

        return Promise.reject(error);
    }
);
export default api;