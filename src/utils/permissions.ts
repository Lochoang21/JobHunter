export const PERMISSION_ACTIONS = {
    CREATE: 'POST',
    READ: 'GET',
    UPDATE: 'PUT',
    DELETE: 'DELETE'
} as const;

export const MODULES = {
    COMPANIES: 'COMPANIES',
    JOBS: 'JOBS',
    PERMISSIONS: 'PERMISSIONS',
    SKILLS: 'SKILLS',
    RESUMES: 'RESUMES',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS',
    FILES: 'FILES'
} as const;

export function hasPermission(
    permissions: any[],
    module: string,
    action: string
): boolean {
    return permissions.some(
        perm => perm.module === module && perm.method === action
    );
}

export function getModulePermissions(
    permissions: any[],
    module: string
): {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
} {
    return {
        canCreate: hasPermission(permissions, module, 'POST'),
        canRead: hasPermission(permissions, module, 'GET'),
        canUpdate: hasPermission(permissions, module, 'PUT'),
        canDelete: hasPermission(permissions, module, 'DELETE')
    };
} 