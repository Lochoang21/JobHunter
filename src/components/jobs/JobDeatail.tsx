'use client';

import React, { useState, useEffect } from 'react';
import JobDescription from './JobDescription';
import ApplyJob from './ApplyJob';
import { Job } from '@/types/job';
import { Company } from '@/types/company';
import { Skill } from '@/types/skill';
import api from '@/services/api';

// Single Job Response interface (for fetching individual job by ID)
interface SingleJobResponse {
  statusCode: number;
  error: null | string;
  message: string;
  data: Job;
}

interface JobDetailProps {
  jobId: string | number;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job by ID
  const fetchJobById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<SingleJobResponse>(`/jobs/${id}`);
      
      // The response now directly contains the Job data
      const jobData = response.data.data;
      setJob(jobData);
      console.log('Job fetched:', jobData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch job');
      console.error('Fetch job error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobById(typeof jobId === 'string' ? parseInt(jobId) : jobId);
    }
  }, [jobId]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          {/* ApplyJob skeleton */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div>
                  <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-64"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-16 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* JobDescription skeleton */}
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lỗi khi tải thông tin công việc</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchJobById(typeof jobId === 'string' ? parseInt(jobId) : jobId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy công việc</h2>
          <p className="text-gray-600 mb-4">Công việc bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <a 
            href="/jobs"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem tất cả công việc
          </a>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Apply Job Component */}
      <div className="mb-6">
        <ApplyJob job={job} />
      </div>
      
      {/* Job Description Component */}
      <JobDescription job={job} />
    </div>
  );
};

export default JobDetail;