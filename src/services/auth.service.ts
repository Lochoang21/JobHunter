import api from './api';
import {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    RegisterResponse,
    AccountResponse,
    User
} from '../types/auth';
import Cookies from 'js-cookie';

// Cookie security options
const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict' as const
};

export const authService = {

    isAuthenticated(): boolean {
        return !!Cookies.get('access_token');
    },

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', data);
        if (response.data.data.access_token) {
            // Store access token in cookie
            Cookies.set('access_token', response.data.data.access_token, COOKIE_OPTIONS);

            // Store role name in a separate cookie for middleware
            const userData = response.data.data.user;
            if (userData.role && userData.role.name) {
                Cookies.set('role_name', userData.role.name, COOKIE_OPTIONS);
            }

            // Store full user data in cookie for permission checking
            Cookies.set('user_data', JSON.stringify(userData), COOKIE_OPTIONS);

            // Tùy chọn: Lưu user data đầy đủ vào localStorage nếu cần
            localStorage.setItem('user_data', JSON.stringify(userData));
        }
        return response.data;
    },

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Always remove cookies
            Cookies.remove('access_token');
            Cookies.remove('role_name');
            Cookies.remove('user_data');
            localStorage.removeItem('user_data');
        }
    },

    async getAccount(): Promise<AccountResponse> {
        const response = await api.get<AccountResponse>('/auth/account');
        // Update user data in cookie with full user object
        const userData = response.data.data.user;
        Cookies.set('user_data', JSON.stringify(userData), COOKIE_OPTIONS);
        return response.data;
    },

    getUserData(): User | null {
        try {
            const userData = Cookies.get('user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            // Clear invalid data
            Cookies.remove('user_data');
            return null;
        }
    },

    // Kiểm tra permission cụ thể
    hasPermission(permissionName: string): boolean {
        const user = this.getUserData();
        return !!user?.role?.permissions?.some(
            permission => permission.name === permissionName
        );
    },

    // Kiểm tra permission theo API path và method
    hasApiPermission(apiPath: string, method: string = 'GET'): boolean {
        const user = this.getUserData();
        return !!user?.role?.permissions?.some(
            permission =>
                permission.apiPath === apiPath &&
                permission.method.toUpperCase() === method.toUpperCase()
        );
    },

    // Kiểm tra role cụ thể
    hasRole(roleName: string): boolean {
        const user = this.getUserData();
        return user?.role?.name === roleName;
    },

    // Lấy danh sách permissions của user
    getUserPermissions(): any[] {
        const user = this.getUserData();
        return user?.role?.permissions || [];
    },

    // Lấy role của user
    getUserRole(): string | null {
        const user = this.getUserData();
        return user?.role?.name || null;
    }
};