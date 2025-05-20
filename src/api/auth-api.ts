import type LoginRequest from "../model/login-request.ts";
import type { LoginResponse } from "../model/login-response.ts";
import api from "./axios-config.ts";
import type { AxiosResponse } from "axios";
import type ApiResponse from "../model/api-response.ts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type UserResponse from "../model/user-response.ts";

const login = async (login: LoginRequest) => {
  const axiosResponse: AxiosResponse<ApiResponse<LoginResponse>> =
    await api.post("/login", login);
  return axiosResponse.data.data;
};

const useLogin = (
  options: Omit<
    UseMutationOptions<LoginResponse, Error, LoginRequest, string[]>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (loginRequest: LoginRequest) => {
      return login(loginRequest);
    },
    ...options,
  });
};

const logout = async () => {
  const axiosResponse: AxiosResponse<ApiResponse<unknown>> =
    await api.post("/perform-logout");
  return axiosResponse.data.data;
};

const useLogout = (
  options: Omit<
    UseMutationOptions<unknown, Error>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return logout();
    },
    ...options,
  });
};

const registerUser = async (user: UserResponse) => {
  const axiosResponse: AxiosResponse<ApiResponse<UserResponse>> =
    await api.post("/register", user);
  return axiosResponse.data.data;
};

const useRegisterUser = (
  options: Omit<
    UseMutationOptions<UserResponse, Error, UserResponse, string[]>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (user: UserResponse) => {
      return registerUser(user);
    },
    ...options,
  });
};
export { useLogin, useLogout, useRegisterUser };
