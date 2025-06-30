"use client";
import { useCurrentUser } from './useCurrentUser';

interface PermissionConfig {
    module: string;
    actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

interface RoleConfig {
    role: string;
}

interface PermissionGuardConfig {
    permission?: string;
    role?: string;
    module?: string;
    actions?: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export const usePermissionGuard = () => {
    const {
        hasPermission,
        hasRole,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canManage
    } = useCurrentUser();

    const checkAccess = (config: PermissionGuardConfig): boolean => {
        // Kiểm tra permission cụ thể
        if (config.permission && !hasPermission(config.permission)) {
            return false;
        }

        // Kiểm tra role cụ thể
        if (config.role && !hasRole(config.role)) {
            return false;
        }

        // Kiểm tra quyền theo module và actions
        if (config.module && config.actions) {
            return config.actions.some(action => {
                switch (action) {
                    case 'create':
                        return canCreate(config.module!);
                    case 'read':
                        return canRead(config.module!);
                    case 'update':
                        return canUpdate(config.module!);
                    case 'delete':
                        return canDelete(config.module!);
                    case 'manage':
                        return canManage(config.module!);
                    default:
                        return false;
                }
            });
        }

        return true;
    };

    const filterMenuItems = <T extends { permission?: PermissionGuardConfig }>(
        items: T[]
    ): T[] => {
        return items.filter(item => {
            if (!item.permission) return true;
            return checkAccess(item.permission);
        });
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    const canPerformAction = (
        module: string,
        action: 'create' | 'read' | 'update' | 'delete' | 'manage'
    ): boolean => {
        switch (action) {
            case 'create':
                return canCreate(module);
            case 'read':
                return canRead(module);
            case 'update':
                return canUpdate(module);
            case 'delete':
                return canDelete(module);
            case 'manage':
                return canManage(module);
            default:
                return false;
        }
    };

    return {
        checkAccess,
        filterMenuItems,
        hasAnyPermission,
        hasAnyRole,
        canPerformAction,
        hasPermission,
        hasRole,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canManage
    };
}; 