import React from "react";
import { User } from "@/types/auth";

interface LoginTabProps {
    user: User;
}

const LoginTab: React.FC<LoginTabProps> = ({ user }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết đăng nhập</h2>
            <p className="text-gray-600 mb-6">Thông tin chi tiết về tài khoản của bạn</p>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Email đăng nhập</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">ID người dùng</p>
                    <p className="font-medium">{user.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ngày tạo tài khoản</p>
                    <p className="font-medium">
                        {user.createAt ? new Date(user.createAt).toLocaleString('vi-VN') : 'Không xác định'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                    <p className="font-medium">
                        {user.updateAt ? new Date(user.updateAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                    </p>
                </div>
                {user.company && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Công ty hiện tại</p>
                        <p className="font-medium">{user.company.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{user.company.address}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginTab; 