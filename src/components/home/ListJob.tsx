'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Job, JobResponse } from '@/types/job';
import CardJob from '../jobs/CardJob';

const ListJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get<JobResponse>('/jobs');
        setJobs(response.data.data.result);
        console.log('Jobs fetched:', response.data.data.result);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch jobs');
        console.error('Fetch jobs error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Danh sách <span className="text-blue-500">việc làm</span>
            </h2>
            <p className="text-gray-600">
              Tìm kiếm cơ hội việc làm phù hợp với bạn
            </p>
          </div>
          <Link
            href="/job"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Đang tải việc làm...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-600">Hiện tại chưa có việc làm nào.</p>
              <p className="text-gray-500 text-sm mt-1">Vui lòng quay lại sau!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <CardJob key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/job"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Xem tất cả các công việc
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ListJob;