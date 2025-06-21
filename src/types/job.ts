import { Company } from "./company";
import { Skill } from "./skill";


export interface Job {
    id: number;
    name: string;
    location: string | null;
    salary: number;
    quantity: number;
    level: "INTERNSHIP" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR" | null;
    description: string | null;
    staterDate: string;
    active: boolean;
    endDate: string;
    updateAt: string | null;
    createAt: string | null;
    createBy: string | null;
    updateBy: string | null;
    company: Company;
    skills: Skill[];
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface ResultPaginationDTO {
    meta: Meta;
    result: Job[];
}

export interface JobResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResultPaginationDTO;
}
export interface CreateJobDTO {
    name: string;
    location?: string;
    salary: number;
    quantity: number;
    level: "INTERNSHIP" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
    description?: string;
    staterDate?: string;
    endDate?: string;
    active: boolean;
    skills?: { id: number }[];
    company: { id: number };
}


export interface UpdateJobDTO {
    id: number;
    name: string;
    location?: string;
    salary: number;
    quantity: number;
    level: "INTERNSHIP" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
    description?: string;
    staterDate?: string;
    endDate?: string;
    active: boolean;
    skills?: Skill[]; // CRITICAL: Backend expects full Skill objects, not just { id: number }[]
    company: { id: number };
}

export interface ResCreateJobDTO {
    id: number;
    name: string;
    location: string | null;
    salary: number;
    quantity: number;
    level: "INTERNSHIP" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
    staterDate: string | null;
    endDate: string | null;
    skills: Skill[];
    createdAt: string;
    createdBy: string;
    active: boolean;
}

export interface ResUpdateJobDTO {
    id: number;
    name: string;
    location: string | null;
    salary: number;
    quantity: number;
    level: "INTERNSHIP" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
    startDate: string | null; // Matches response
    endDate: string | null;
    skills: string[]; // Matches response
    updatedAt: string;
    updatedBy: string;
    active: boolean;
}

export interface CreateJobResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResCreateJobDTO;
}

export interface UpdateJobResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResUpdateJobDTO;
}

export interface DeleteJobResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: null;
}