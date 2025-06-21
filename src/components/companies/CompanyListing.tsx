'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import CompanyCard from './CompanyCard';
import { Company, CompanyResponse } from '@/types/company';
import { Pagination } from 'flowbite-react';


const CompanyListing: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 6; // Display 6 companies per page
  
    // Fetch companies
    useEffect(() => {
      const fetchCompanies = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get<CompanyResponse>('/companies');
          setCompanies(response.data.data.result);
          console.log('Companies fetched:', response.data.data.result);
          setCurrentPage(1); // Reset to page 1 when new companies are fetched
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch companies');
          console.error('Fetch companies error:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanies();
    }, []);
  
    // Pagination logic
    const totalPages = Math.ceil(companies.length / companiesPerPage);
    const paginatedCompanies = companies.slice(
      (currentPage - 1) * companiesPerPage,
      currentPage * companiesPerPage
    );
  
    const onPageChange = (page: number) => {
      setCurrentPage(page);
      // Optionally scroll to top of company list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-80 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-100 rounded w-96 animate-pulse"></div>
            </div>
  
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-100 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                    <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  
    // Error state
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Companies</h1>
            <p className="text-gray-600">
              Based on your profile, company preferences, and recent activity
            </p>
          </div>
  
          {/* Companies Grid */}
          {companies.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hiện tại chưa có công ty nào</h3>
              <p className="text-gray-500">Vui lòng quay lại sau để xem thêm công ty mới!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex overflow-x-auto sm:justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default CompanyListing;