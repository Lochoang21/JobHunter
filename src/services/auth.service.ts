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
                console.log("Setting role_name cookie:", userData.role.name);
                Cookies.set('role_name', userData.role.name, COOKIE_OPTIONS);
            }
            
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
            localStorage.removeItem('user_data');
        }
    },

    async getAccount(): Promise<AccountResponse> {
        const response = await api.get<AccountResponse>('/auth/account');
        // Update user data in cookie with full user object
        const userData = response.data.data.user;
        console.log("Updating user data in cookie from getAccount:", userData);
        Cookies.set('user_data', JSON.stringify(userData), COOKIE_OPTIONS);
        return response.data;
    },

    getUserData(): User | null {
        try {
            const userData = Cookies.get('user_data');
            console.log("Getting user data from cookie, exists:", !!userData);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            // Clear invalid data
            Cookies.remove('user_data');
            return null;
        }
    },

    // Optional: Check for specific permissions
    hasPermission(permissionName: string): boolean {
        const user = this.getUserData();
        return !!user?.role?.permissions?.some(
            permission => permission.name === permissionName
        );
    }
};