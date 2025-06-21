export interface Company {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    logo: string | null;
    createAt: string | null;
    updateAt: string | null;
    createBy: string | null;
    updateBy: string | null;
    jobCount?: number;
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface ResultPaginationDTO {
    meta: Meta;
    result: Company[];
}

export interface CompanyResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResultPaginationDTO;
}

export interface DeleteCompanyResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: null;
}
export interface CreateCompanyDTO {
    name: string;
    description?: string;
    address?: string;
    logo?: string;
}

export interface UpdateCompanyDTO {
    id: number;
    name: string;
    description?: string;
    address?: string;
    logo?: string;
}

export interface CreateCompanyResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Company;
}

export interface UpdateCompanyResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Company;
}