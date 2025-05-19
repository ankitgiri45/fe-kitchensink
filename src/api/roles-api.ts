import type { AxiosResponse } from "axios";
import type ApiResponse from "../model/api-response.ts";
import api from "./axios-config.ts";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { RoleResponse } from "../model/role-response.ts";

const roles = async () => {
  const axiosResponse: AxiosResponse<ApiResponse<RoleResponse[]>> =
    await api.get("/roles");
  return axiosResponse.data.data;
};

const useRoles = (
  options: Omit<UseQueryOptions<RoleResponse[], Error>, "queryFn" | "queryKey">,
) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roles,
    ...options,
  });
};
export { useRoles };
