"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';
import { hasPermission, getModulePermissions } from '@/utils/permissions';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    permissions: any[];
    hasPermission: (module: string, action: string) => boolean;
    getModulePermissions: (module: string) => {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
    login: (username: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.isAuthenticated()) {
                const response = await authService.getAccount();
                setUser(response.data.user);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            setError(null);
            const response = await authService.login({ username, password });
            setUser(response.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (data: any) => {
        try {
            setError(null);
            await authService.register(data);
            router.push('/auth/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/auth/login');
        } catch (err: any) {
            console.error('Logout failed:', err);
        }
    };

    const permissions = user?.role?.permissions || [];

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                permissions,
                hasPermission: (module, action) => hasPermission(permissions, module, action),
                getModulePermissions: (module) => getModulePermissions(permissions, module),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 