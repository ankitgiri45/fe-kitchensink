import type {RoleResponse} from "./role-response.ts";

export default interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    roles: RoleResponse[];
    accessToken?: string;
    refreshToken?: string;
    createdBy?: string;
    createdAt?: string;
    lastUpdatedAt?: string;
    lastUpdatedBy?: string;
    password?: string;
}