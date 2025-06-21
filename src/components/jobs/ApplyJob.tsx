'use client';
import React from 'react';
import { Job } from '@/types/job';

const ApplyJob: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Logo and Job Details */}
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={`${job.company?.name || 'Company'} logo`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            job.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.name}</h3>
          <p className="text-sm text-gray-500">
            {job.company?.name || 'Unknown Company'} • {job.location || 'No location'} • {job.level}
          </p>
        </div>
      </div>

      {/* Share Icon and Apply Button */}
      <div className="flex items-center space-x-4">
        <svg
          className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M9 16h6M9 8h6"
          />
        </svg>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Apply
        </button>
      </div>
    </div>
  );
};

export default ApplyJob;