import axios, {
  AxiosError,
  type AxiosError as AxiosErrorType,
  type AxiosResponse,
} from "axios";
import type ApiResponse from "../model/api-response.ts";
import store, { setError, setSuccess } from "../store/root-store.ts";
import { UI_ENDPOINTS } from "../constant/ui-endpoints.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const noTokenRequired = ["/login", "/register", "/roles/default"];
const sessionExpiredMessage =
  "Session expired. You will be redirected to login page out in 5 sec.";
const connectionErrorMessage =
  "Server is not reachable. Please try again later.";
const timeoutDuration = 5000;
const httpStatusUnauthorized = 401;

// Add this before exporting api
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!noTokenRequired.includes(config.url ?? "")) {
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      return Promise.reject(
        new AxiosError(sessionExpiredMessage, String(httpStatusUnauthorized)),
      );
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    store.dispatch(setSuccess(response.data));
    return response;
  },
  (error: AxiosErrorType<ApiResponse<unknown>>) => {
    let data: ApiResponse<unknown>;
    if (
      error.code === AxiosError.ERR_NETWORK ||
      error.code === AxiosError.ERR_CANCELED
    ) {
      data = {
        status: 500,
        message: error.message,
        data: connectionErrorMessage,
      };
    } else if (
      error.code === String(httpStatusUnauthorized) ||
      error.status === httpStatusUnauthorized
    ) {
      data = (error.response?.data ?? {
        status: httpStatusUnauthorized,
        message: error.message,
      }) as ApiResponse<unknown>;

      if (window.location.pathname !== UI_ENDPOINTS.LOGIN) {
        if (data.message !== sessionExpiredMessage) {
          data.message = data.message
            ? data.message.concat("\n", sessionExpiredMessage)
            : sessionExpiredMessage;
        }
        console.log("Redirecting to login page");
        setTimeout(() => {
          localStorage.clear();
          window.location.replace(UI_ENDPOINTS.LOGIN);
        }, timeoutDuration);
      }
    } else {
      data = error.response?.data as ApiResponse<unknown>;
    }
    store.dispatch(setError(data));
    return Promise.reject(error);
  },
);
export default api;
