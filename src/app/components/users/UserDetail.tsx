"use client";
import React from "react";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Badge } from "flowbite-react";
import { Icon } from "@iconify/react";
import { User, GenderEnum } from "@/types/user";

interface UserDetailProps {
    user: User | null;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({
    user, isOpen, onOpen, onClose,
}) => {
    // Get gender icon and color
    const getGenderDisplay = (gender: string | null | undefined) => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return {
                    icon: 'heroicons:user',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    label: 'Male'
                };
            case 'female':
                return {
                    icon: 'heroicons:user',
                    color: 'text-pink-600',
                    bgColor: 'bg-pink-100',
                    label: 'Female'
                };
            default:
                return {
                    icon: 'heroicons:user',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    label: 'Not specified'
                };
        }
    };

    // Format date with time
    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get user avatar initials
    const getUserInitials = (name: string | null | undefined, email: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return email.slice(0, 2).toUpperCase();
    };

    const genderDisplay = getGenderDisplay(user?.gender);

    return (
        <>
            <Drawer
                open={isOpen}
                onClose={onClose}
                position="right"
                className="w-96 max-w-full"
            >
                <div className="h-full flex flex-col bg-white">
                    {/* Custom Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Icon icon="heroicons:user-circle" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">User Details</h2>
                                    <p className="text-sm text-blue-100">Complete user information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Icon icon="heroicons:x-mark" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {user ? (
                            <div className="p-6">
                                {/* User Avatar and Basic Info */}
                                <div className="flex flex-col items-center text-center mb-8 p-6 bg-gray-50 rounded-xl">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                                        {getUserInitials(user.name, user.email)}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                        {user.name || "Unnamed User"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1 rounded-full ${genderDisplay.bgColor}`}>
                                            <Icon icon={genderDisplay.icon} className={`w-4 h-4 ${genderDisplay.color}`} />
                                        </div>
                                        <span className="text-sm text-gray-600">{genderDisplay.label}</span>
                                    </div>
                                </div>

                                {/* Detailed Information */}
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Icon icon="heroicons:identification" className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-gray-900">Personal Information</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:hashtag" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">User ID</span>
                                                </div>
                                                <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                                    #{user.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:calendar" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">Age</span>
                                                </div>
                                                <span className="text-sm text-gray-900">
                                                    {user.age ? `${user.age} years old` : "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between py-2">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:map-pin" className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <span className="text-sm font-medium text-gray-700">Address</span>
                                                </div>
                                                <span className="text-sm text-gray-900 text-right max-w-48">
                                                    {user.address || "Not specified"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Organization Information */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Icon icon="heroicons:building-office" className="w-5 h-5 text-green-600" />
                                            <h4 className="font-semibold text-gray-900">Organization</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:building-office-2" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">Company</span>
                                                </div>
                                                <Badge
                                                    color={user.company ? "indigo" : "gray"}
                                                    className="text-xs"
                                                >
                                                    {user.company?.name || "No company"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:shield-check" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">Role</span>
                                                </div>
                                                <Badge
                                                    color={user.role ? "indigo" : "gray"}
                                                    className="text-xs"
                                                >
                                                    {user.role?.name || "No role assigned"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Information */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Icon icon="heroicons:clock" className="w-5 h-5 text-purple-600" />
                                            <h4 className="font-semibold text-gray-900">System Information</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <Icon icon="heroicons:plus-circle" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">Created</span>
                                                </div>
                                                <span className="text-sm text-gray-900">
                                                    {formatDateTime(user.createAt)}
                                                </span>
                                            </div>
                                            {user.updateAt && (
                                                <div className="flex items-center justify-between py-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Icon icon="heroicons:pencil-square" className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">Last Updated</span>
                                                    </div>
                                                    <span className="text-sm text-gray-900">
                                                        {formatDateTime(user.updateAt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Icon icon="heroicons:user-circle" className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No User Selected</h3>
                                <p className="text-sm text-gray-500">
                                    Select a user from the list to view their details
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <Button
                            color="gray"
                            onClick={onClose}
                            className="w-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
                        >
                            <Icon icon="heroicons:x-mark" className="w-4 h-4" />
                            <span>Close</span>
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default UserDetail;