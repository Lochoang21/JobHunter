import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { Permission } from '@/types/permission';

/**
 * Custom hook để lấy thông tin người dùng hiện tại
 * @returns Object chứa thông tin user và các utility functions
 */
export const useCurrentUser = () => {
    const { user, loading } = useAuth();

    /**
     * Lấy thông tin user từ context (realtime)
     */
    const getCurrentUser = (): User | null => {
        return user;
    };

    /**
     * Lấy thông tin user từ cookie/localStorage (fallback)
     */
    const getStoredUser = (): User | null => {
        return authService.getUserData();
    };

    /**
     * Kiểm tra user đã đăng nhập chưa
     */
    const isAuthenticated = (): boolean => {
        return authService.isAuthenticated() && !!user;
    };

    /**
     * Lấy user ID
     */
    const getUserId = (): number | null => {
        return user?.id || null;
    };

    /**
     * Lấy email của user
     */
    const getUserEmail = (): string | null => {
        return user?.email || null;
    };

    /**
     * Lấy tên của user
     */
    const getUserName = (): string | null => {
        return user?.name || null;
    };

    /**
     * Lấy role của user
     */
    const getUserRole = (): string | null => {
        return user?.role?.name || null;
    };

    /**
     * Lấy danh sách permissions của user
     */
    const getUserPermissions = (): Permission[] => {
        return user?.role?.permissions || [];
    };

    /**
     * Lấy danh sách tên permissions của user
     */
    const getUserPermissionNames = (): string[] => {
        return getUserPermissions().map(p => p.name);
    };

    /**
     * Lấy danh sách API paths của user
     */
    const getUserApiPaths = (): string[] => {
        return getUserPermissions().map(p => p.apiPath);
    };

    /**
     * Kiểm tra user có role cụ thể không
     */
    const hasRole = (roleName: string): boolean => {
        return user?.role?.name === roleName;
    };

    /**
     * Kiểm tra user có permission cụ thể không (theo tên)
     */
    const hasPermission = (permissionName: string): boolean => {
        return authService.hasPermission(permissionName);
    };

    /**
     * Kiểm tra user có permission theo API path và method không
     */
    const hasApiPermission = (apiPath: string, method: string = 'GET'): boolean => {
        const permissions = getUserPermissions();
        return permissions.some(p =>
            p.apiPath === apiPath && p.method.toUpperCase() === method.toUpperCase()
        );
    };

    /**
     * Kiểm tra user có quyền tạo (CREATE) không
     */
    const canCreate = (module: string): boolean => {
        return hasApiPermission(`/api/v1/${module.toLowerCase()}`, 'POST');
    };

    /**
     * Kiểm tra user có quyền đọc (READ) không
     */
    const canRead = (module: string): boolean => {
        return hasApiPermission(`/api/v1/${module.toLowerCase()}`, 'GET');
    };

    /**
     * Kiểm tra user có quyền cập nhật (UPDATE) không
     */
    const canUpdate = (module: string): boolean => {
        return hasApiPermission(`/api/v1/${module.toLowerCase()}`, 'PUT');
    };

    /**
     * Kiểm tra user có quyền xóa (DELETE) không
     */
    const canDelete = (module: string): boolean => {
        return hasApiPermission(`/api/v1/${module.toLowerCase()}`, 'DELETE');
    };

    /**
     * Kiểm tra user có quyền quản lý module cụ thể không
     */
    const canManage = (module: string): boolean => {
        return canCreate(module) || canRead(module) || canUpdate(module) || canDelete(module);
    };

    /**
     * Refresh thông tin user từ server
     */
    const refreshUserData = async (): Promise<User | null> => {
        try {
            if (authService.isAuthenticated()) {
                const response = await authService.getAccount();
                return response.data.user;
            }
            return null;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    };

    return {
        // User data
        user,
        currentUser: getCurrentUser(),
        storedUser: getStoredUser(),

        // Status
        loading,
        isAuthenticated: isAuthenticated(),

        // User properties
        userId: getUserId(),
        userEmail: getUserEmail(),
        userName: getUserName(),
        userRole: getUserRole(),
        userPermissions: getUserPermissions(),
        userPermissionNames: getUserPermissionNames(),
        userApiPaths: getUserApiPaths(),

        // Permission checks
        hasRole,
        hasPermission,
        hasApiPermission,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canManage,

        // Utility functions
        refreshUserData,

        // Helper functions
        getCurrentUser,
        getStoredUser,
        getUserId,
        getUserEmail,
        getUserName,
        getUserRole,
        getUserPermissions,
        getUserPermissionNames,
        getUserApiPaths,
    };
}; 