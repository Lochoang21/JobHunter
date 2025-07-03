import React from "react";

const NotificationsTab: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cài đặt thông báo</h2>
            <p className="text-gray-600 mb-6">Quản lý cách bạn nhận thông báo</p>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-medium">Thông báo email</p>
                        <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-medium">Thông báo việc làm mới</p>
                        <p className="text-sm text-gray-600">Nhận thông báo về việc làm phù hợp</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                </div>
            </div>
        </div>
    );
};

export default NotificationsTab; 