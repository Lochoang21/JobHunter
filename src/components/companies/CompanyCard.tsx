'use client';

import React from 'react';
import { Company } from '@/types/company';
import Link from 'next/link';
// Types

// Sample job counts for demonstration (you can fetch this from API)
const getJobCount = (companyId: number): number => {
  // This would typically come from your API
  return Math.floor(Math.random() * 10) + 1; // Random number between 1-10
};

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const jobCount = getJobCount(company.id);

  return (
    <Link href={`/company/${company.id}`}>
     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* Header with logo and job count */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {company.logo && !company.logo.includes('undefined') ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600 ${
                company.logo && !company.logo.includes('undefined') ? 'hidden' : ''
              }`}
            >
              {company.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <span className="text-blue-600 text-sm font-medium">{jobCount} Jobs</span>
      </div>

      {/* Company name */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{company.name}</h3>

      {/* Company description */}
      {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p> */}

      {/* Location */}
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {company.address}
      </div>
    </div>
    </Link>
   
  );
};

export default CompanyCard;