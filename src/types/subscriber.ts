export interface Skill {
    id: number;
    name: string;
    createAt: string | null;
    updateAt: string | null;
    createBy: string | null;
    updateBy: string | null;
}

export interface Subscriber {
    id: number;
    name: string;
    email: string;
    skills: Skill[];
    createAt: string;
    updateAt?: string;
    createBy: string;
    updateBy?: string;
}

export interface CreateSubscriberRequest {
    name: string;
    email: string;
    skills: number[]; // Array of skill IDs
}

export interface UpdateSubscriberRequest {
    id: number;
    name: string;
    email: string;
    skills: number[]; // Array of skill IDs
}

export interface SubscriberResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Subscriber;
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface SubscribersResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: Meta;
        result: Subscriber[];
    };
}

// Email Job Response Types
export interface CompanyEmail {
    name: string;
}

export interface SkillEmail {
    name: string;
}

export interface ResEmailJob {
    name: string;
    salary: number;
    company: CompanyEmail;
    description: string;
    level: string;
    skills: SkillEmail[];
} 