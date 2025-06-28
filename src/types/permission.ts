export interface Permission {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
}

export interface PermissionResponse {
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
        result: Permission[];
    };
}

export interface CreatePermissionResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Permission;
}

export interface UpdatePermissionResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Permission;
}

export interface DeletePermissionResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: any;
} 