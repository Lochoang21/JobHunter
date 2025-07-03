'use client'

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import ProfileTab from "./ProfileTab";
import LoginTab from "./LoginTab";
import NotificationsTab from "./NotificationsTab";

const Profile: React.FC = () => {
    const { user: contextUser, loading: contextLoading } = useCurrentUser();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await authService.getAccount();
                setUser(response.data.user);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // Fallback to context user if API fails
                setUser(contextUser);
            } finally {
                setLoading(false);
            }
        };

        if (authService.isAuthenticated()) {
            fetchUserData();
        } else {
            setUser(contextUser);
            setLoading(false);
        }
    }, [contextUser]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return (
        <div className="text-center text-gray-500 mt-8">
            Không tìm thấy thông tin người dùng.
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 my-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Hồ sơ của tôi
                    </button>
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'login'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Chi tiết đăng nhập
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Thông báo
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'profile' && <ProfileTab user={user} />}
                {activeTab === 'login' && <LoginTab user={user} />}
                {activeTab === 'notifications' && <NotificationsTab />}
            </div>
        </div>
    );
};

export default Profile;