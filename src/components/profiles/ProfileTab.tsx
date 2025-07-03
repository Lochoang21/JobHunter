import React from "react";
import { User } from "@/types/auth";

interface ProfileTabProps {
    user: User;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cơ bản</h1>
                <p className="text-gray-600">
                    Đây là thông tin cá nhân của bạn mà bạn có thể cập nhật bất cứ lúc nào.
                </p>
            </div>

            {/* Profile Photo Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ảnh hồ sơ</h2>
                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                            <div className="text-blue-600 mb-2">
                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-blue-600 font-medium mb-1">Nhấp để thay thế</p>
                            <p className="text-blue-600 text-sm">hoặc kéo và thả</p>
                            <p className="text-gray-500 text-xs mt-2">
                                SVG, PNG, JPG hoặc GIF (tối đa 400 x 400px)
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Hình ảnh này sẽ được hiển thị công khai như ảnh hồ sơ của bạn,
                            nó sẽ giúp nhà tuyển dụng nhận ra bạn!
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Details Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Chi tiết cá nhân</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={user.name || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            defaultValue={user.email || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tuổi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            defaultValue={user.age || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tuổi"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            defaultValue={user.gender || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            defaultValue={user.address || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập địa chỉ"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Company Information Section - Updated UI */}
            {user.company && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Thông tin công ty</h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Đã xác minh
                        </span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.company.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Địa chỉ</span>
                                        </div>
                                        <p className="text-gray-900 text-sm">{user.company.address || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Mô tả</span>
                                        </div>
                                        <p className="text-gray-900 text-sm">{user.company.description || 'Chưa có mô tả'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Information Section - Updated UI */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin tài khoản</h2>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v4a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Ngày tạo tài khoản</p>
                                    <p className="text-gray-900 font-medium text-sm">
                                        {user.createAt ? new Date(user.createAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Cập nhật lần cuối</p>
                                    <p className="text-gray-900 font-medium text-sm">
                                        {user.updateAt ? new Date(user.updateAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Trạng thái tài khoản</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Hoạt động
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    Lưu hồ sơ
                </button>
            </div>
        </div>
    );
};

export default ProfileTab; 