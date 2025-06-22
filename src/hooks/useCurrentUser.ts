import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

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
     * Kiểm tra user có role cụ thể không
     */
    const hasRole = (roleName: string): boolean => {
        return user?.role?.name === roleName;
    };

    /**
     * Kiểm tra user có permission cụ thể không
     */
    const hasPermission = (permissionName: string): boolean => {
        return authService.hasPermission(permissionName);
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

        // Utility functions
        hasRole,
        hasPermission,
        refreshUserData,

        // Helper functions
        getCurrentUser,
        getStoredUser,
        getUserId,
        getUserEmail,
        getUserName,
        getUserRole,
    };
}; 