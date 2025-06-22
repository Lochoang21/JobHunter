// Resume types
export enum ResumeStatusEnum {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface Resume {
    id: number;
    email: string;
    url: string;
    status: ResumeStatusEnum;
    companyName: string;
    createAt: string;
    updateAt: string;
    createBy: string;
    updateBy: string;
    user: {
        id: number;
        name: string;
    };
    job: {
        id: number;
        name: string;
    };
}

export interface ResumeResponse {
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
        result: Resume[];
    };
}