import { Permission } from "./permission";

export interface Role {
    id: number;
    name: string;
    description: string;
    active: boolean;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
    permissions: Permission[];
}

export interface UpdateRoleDTO {
    id: number;
    name: string;
    description: string;
    active: boolean;
    permissions: { id: number }[];
}

export interface RoleResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Role[];
    };
}

export interface CreateRoleResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Role;
}

export interface UpdateRoleResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Role;
}

export interface DeleteRoleResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: any;
} 