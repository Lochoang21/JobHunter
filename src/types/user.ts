// auth.tsx (or types/user.ts)
import { Company } from "./company";
export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
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
    gender: GenderEnum | null;
    address: string | null;
    age: number | null;
    createAt: string | null;
    updateAt: string | null;
    company: Company | null;
    role: Role | null;
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface ResultPaginationDTO {
    meta: Meta;
    result: User[];
}

export interface ApiResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResultPaginationDTO;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    address: string;
    gender: GenderEnum;
    age: number;
}
export interface UpdateUserDTO {
    id: number;
    email: string;
    name: string;
    address: string;
    gender: GenderEnum;
    age: number;
    company?: { id: number } | null;
    role?: { id: number } | null;
}

export interface ResCreateUserDTO {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: GenderEnum;
    address: string;
    createAt: string;
    company: Company | null;
    role: Role | null;
}

export interface ResUpdateUserDTO {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: GenderEnum;
    address: string;
    createAt: string;
    company: Company | null;
    role: Role | null;
}

export interface CreateUserResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResCreateUserDTO;
}

export interface UpdateUserResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResCreateUserDTO; // Reusing ResCreateUserDTO for simplicity
}
export interface DeleteUserResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: null;
}