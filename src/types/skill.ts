export interface Skill {
    id: number;
    name: string;
    createAt: string | null;
    updateAt: string | null;
    createBy: string | null;
    updateBy: string | null;
}

export interface SkillResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResultPaginationDTO;
}

export interface CreateSkillResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Skill;
}

export interface UpdateSkillResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: Skill;
}

export interface DeleteSkillResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: null;
}

export interface ResultPaginationDTO {
    meta: Meta;
    result: Skill[];
}
export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}