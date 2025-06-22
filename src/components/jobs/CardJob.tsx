import React from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';

// Get category color based on level
const getLevelColor = (level: string | null) => {
  const colors: { [key: string]: string } = {
    'INTERNSHIP': 'text-blue-600',
    'FRESHER': 'text-green-600',
    'JUNIOR': 'text-yellow-600',
    'MIDDLE': 'text-orange-600',
    'SENIOR': 'text-red-600'
  };
  return colors[level || ''] || 'bg-gray-100 text-gray-600';
};

// Generate company logo placeholder
const getCompanyLogo = (companyName: string | null | undefined) => {
  if (!companyName) return 'N/A';
  return companyName.charAt(0).toUpperCase();
};

// Get random color for company logo
const getLogoColor = (companyName: string | null | undefined) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  if (!companyName) return 'bg-gray-500';
  const index = companyName.length % colors.length;
  return colors[index];
};

interface CardJobProps {
  job: Job;
}

const CardJob: React.FC<CardJobProps> = ({ job }) => {
  return (
    <Link href={`/job/${job.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={`${job.company.name} logo`}
                className="w-12 h-12 rounded-lg object-contain mr-3"
                onError={(e) => {
                    e.currentTarget.src = '/images/logos/companies-icon.jpg';
                    e.currentTarget.onerror = null; // Prevent retry loop
                }}
              />
            ) : null}
            <div className={`w-12 h-12 ${getLogoColor(job.company?.name)} rounded-lg flex items-center justify-center text-white font-bold text-lg ${job.company?.logo ? 'hidden' : ''}`}>
              {getCompanyLogo(job.company?.name)}
            </div>
          </div>
          <span className="px-3 py-1 text-sm border border-purple-300 text-purple-600 rounded bg-purple-50">
            {job.active ? 'Đang tuyển' : 'Đã đóng'}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {job.name || 'Chưa có tên'}
        </h3>
        
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">{job.company?.name || 'Chưa có tên công ty'}</span>
          <span className="mx-2">•</span>
          <span>{job.location || 'Chưa có địa điểm'}</span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Lương:</span>
            <span className="text-green-600 font-semibold">
              {job.salary ? `${job.salary.toLocaleString()} VND` : 'Thỏa thuận'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Số lượng:</span>
            <span>{job.quantity || 1} người</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.level && (
            <span className={`py-1 rounded-full text-sm font-medium ${getLevelColor(job.level)}`}>
              {job.level}
            </span>
          )}
          {job.skills && job.skills.length > 0 && (
            job.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-2 rounded-full text-xs font-medium bg-teal-100 text-teal-600"
              >
                {skill.name}
              </span>
            ))
          )}
        </div>

        <div className="text-xs text-gray-500 mt-auto">
          {job.endDate && (
            <div>Hạn nộp: {new Date(job.endDate).toLocaleDateString('vi-VN')}</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardJob;