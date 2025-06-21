'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBuilding } from 'react-icons/fa';
import api from '@/services/api';
import { Company, CompanyResponse } from '@/types/company';

const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-yellow-100 text-yellow-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
];

const CompanyCategories = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await api.get<CompanyResponse>('/companies');
                setCompanies(response.data.data.result);
                console.log('Companies fetched:', response.data.data.result);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch companies');
                console.error('Fetch companies error:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Danh mục công ty hàng đầu</h2>
                    <p className="text-gray-600">
                        Khám phá các công ty nổi bật và cơ hội việc làm của họ
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.slice(0, 6).map((company, index) => (
                            <Link
                                key={company.id}
                                href={`/company/${company.id}`}
                                className="block"
                            >
                                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div
                                        className={`${
                                            colors[index % colors.length]
                                        } w-16 h-16 rounded-lg flex items-center justify-center mb-4`}
                                    >
                                        {company.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={`${company.name} logo`}
                                                className="h-12 w-12 rounded-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/logos/companies-icon.jpg';
                                                    e.currentTarget.onerror = null; // Prevent retry loop
                                                }}
                                            />
                                        ) : (
                                            <FaBuilding className="text-4xl" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{company.name || 'N/A'}</h3>
                                    <p className="text-gray-600">
                                        {company.jobCount !== undefined
                                            ? `${company.jobCount} việc làm`
                                            : 'Xem cơ hội việc làm'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/company"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Xem tất cả công ty
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CompanyCategories;