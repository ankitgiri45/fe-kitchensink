import type {AxiosResponse} from "axios";
import type ApiResponse from "../model/api-response.ts";
import api from "./axios-config.ts";
import type UserResponse from "../model/user-response.ts";
import {useMutation, type UseMutationOptions, useQuery, type UseQueryOptions} from "@tanstack/react-query";


const users = async () => {
    const axiosResponse: AxiosResponse<ApiResponse<UserResponse[]>> = await api.get('/users');
    return axiosResponse.data.data;
}

const useUsers = (options: Omit<UseQueryOptions<UserResponse[], Error, UserResponse[], string[]>, 'queryFn' | 'queryKey'>) => {
    return useQuery({
        queryKey: ['users'],
        queryFn: users,
        ...options
    });
}


const user = async (id: string) => {
    const axiosResponse: AxiosResponse<ApiResponse<UserResponse>> = await api.get(`/users/${id}`);
    return axiosResponse.data.data;
}

const useUser = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => user(id),
        enabled: !!id,
    });
}

const createUser = async (user: UserResponse) => {
    const axiosResponse: AxiosResponse<ApiResponse<UserResponse>> = await api.post('/users', user);
    return axiosResponse.data.data;
}

const useCreateUser = (options: Omit<UseMutationOptions<UserResponse, Error, UserResponse, string[]>, 'mutationKey' | 'mutationFn'>) => {
    return useMutation({
        mutationKey: ['createUser'],
        mutationFn: (user: UserResponse) => {
            return createUser(user);
        },
        ...options
    });
}

const updateUser = async (user: UserResponse) => {
    const axiosResponse: AxiosResponse<ApiResponse<UserResponse>> = await api.put(`/users/${user.id}`, user);
    return axiosResponse.data.data;
}

const useUpdateUser = (options: Omit<UseMutationOptions<UserResponse, Error, UserResponse, string[]>, 'mutationKey' | 'mutationFn'>) => {
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: (user: UserResponse) => {
            return updateUser(user);
        },
        ...options
    });
}

const deleteUser = async (id: string) => {
    const axiosResponse: AxiosResponse<ApiResponse<unknown>> = await api.delete(`/users/${id}`);
    return axiosResponse.data.data;
}

const useDeleteUser = (options: Omit<UseMutationOptions<unknown, Error, string, string[]>, 'mutationKey' | 'mutationFn'>) => {
    return useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: (id: string) => {
            return deleteUser(id);
        },
        ...options
    });
}

export {useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser};