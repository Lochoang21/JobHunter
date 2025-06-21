export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    age: number;
    gender: GenderEnum;
    address: string;
    password: string;
}

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

export interface User {
    id: number;
    email: string;
    name: string | null;
    role: Role | null;
}

export interface LoginResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        user: User;
        access_token: string;
    };
}

export interface RegisterResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        age: number;
        gender: GenderEnum;
        address: string;
        createAt: string;
        company: any | null;
    };
}

export interface AccountResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        user: User;
    };
} 