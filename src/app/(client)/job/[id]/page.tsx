'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import JobDetail from '@/components/jobs/JobDeatail';

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const jobId = params?.id as string;

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ID công việc không hợp lệ</h2>
          <p className="text-gray-600 mb-4">Vui lòng kiểm tra lại đường dẫn.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <JobDetail jobId={jobId} />
    </div>
  );
};

export default JobDetailPage;