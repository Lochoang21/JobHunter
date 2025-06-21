'use client';

import React from 'react';
import Link from 'next/link';
import { FaCode, FaChartLine, FaGraduationCap, FaBriefcase, FaLaptopCode, FaUserTie } from 'react-icons/fa';

const categories = [
    {
        id: 1,
        title: 'Công nghệ thông tin',
        icon: <FaCode className="text-4xl" />,
        count: 1200,
        color: 'bg-blue-100 text-blue-600',
    },
    {
        id: 2,
        title: 'Kinh doanh & Marketing',
        icon: <FaChartLine className="text-4xl" />,
        count: 850,
        color: 'bg-green-100 text-green-600',
    },
    {
        id: 3,
        title: 'Giáo dục & Đào tạo',
        icon: <FaGraduationCap className="text-4xl" />,
        count: 450,
        color: 'bg-purple-100 text-purple-600',
    },
    {
        id: 4,
        title: 'Tài chính & Kế toán',
        icon: <FaBriefcase className="text-4xl" />,
        count: 680,
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        id: 5,
        title: 'Thiết kế & Sáng tạo',
        icon: <FaLaptopCode className="text-4xl" />,
        count: 520,
        color: 'bg-pink-100 text-pink-600',
    },
    {
        id: 6,
        title: 'Nhân sự & Hành chính',
        icon: <FaUserTie className="text-4xl" />,
        count: 320,
        color: 'bg-indigo-100 text-indigo-600',
    },
];

const JobCategories = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Danh mục việc làm phổ biến</h2>
                    <p className="text-gray-600">
                        Khám phá các cơ hội việc làm theo lĩnh vực bạn quan tâm
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/jobs?category=${encodeURIComponent(category.title)}`}
                            className="block"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className={`${category.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                                <p className="text-gray-600">{category.count} việc làm</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/jobs"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Xem tất cả danh mục
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default JobCategories; 