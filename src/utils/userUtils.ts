import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

/**
 * Utility functions để quản lý thông tin user
 */

/**
 * Lấy thông tin user hiện tại từ storage
 */
export const getCurrentUser = (): User | null => {
    return authService.getUserData();
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isUserAuthenticated = (): boolean => {
    return authService.isAuthenticated();
};

/**
 * Lấy user ID hiện tại
 */
export const getCurrentUserId = (): number | null => {
    const user = getCurrentUser();
    return user?.id || null;
};

/**
 * Lấy email của user hiện tại
 */
export const getCurrentUserEmail = (): string | null => {
    const user = getCurrentUser();
    return user?.email || null;
};

/**
 * Lấy tên của user hiện tại
 */
export const getCurrentUserName = (): string | null => {
    const user = getCurrentUser();
    return user?.name || null;
};

/**
 * Lấy role của user hiện tại
 */
export const getCurrentUserRole = (): string | null => {
    const user = getCurrentUser();
    return user?.role?.name || null;
};

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasUserRole = (roleName: string): boolean => {
    const user = getCurrentUser();
    return user?.role?.name === roleName;
};

/**
 * Kiểm tra user có permission cụ thể không
 */
export const hasUserPermission = (permissionName: string): boolean => {
    return authService.hasPermission(permissionName);
};

/**
 * Kiểm tra user có phải là admin không
 */
export const isUserAdmin = (): boolean => {
    return hasUserRole('ADMIN');
};

/**
 * Kiểm tra user có phải là company user không
 */
export const isUserCompany = (): boolean => {
    return hasUserRole('COMPANY');
};

/**
 * Kiểm tra user có phải là job seeker không
 */
export const isUserJobSeeker = (): boolean => {
    return hasUserRole('JOB_SEEKER');
};

/**
 * Lấy thông tin user dưới dạng object để sử dụng trong API calls
 */
export const getUserForApi = () => {
    const user = getCurrentUser();
    return user ? { id: user.id } : null;
};

/**
 * Format tên user để hiển thị
 */
export const formatUserName = (user: User | null): string => {
    if (!user) return 'Unknown User';
    return user.name || user.email || 'Unknown User';
};

/**
 * Lấy avatar fallback từ tên user
 */
export const getUserAvatarFallback = (user: User | null): string => {
    if (!user) return 'U';
    const name = user.name || user.email || 'User';
    return name.charAt(0).toUpperCase();
}; 