'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchJobProps {
  onSearch?: (jobTitle: string, location: string) => void;
}

const SearchJob: React.FC<SearchJobProps> = ({ onSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobTitle, setJobTitle] = useState(searchParams.get('jobTitle') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'TP Hồ Chí Minh');
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const popularTags = ['UI Designer', 'UX Researcher', 'Android', 'Admin'];

  // Mảng các thành phố
  const cities = [
    'TP Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Bình Dương',
    'Cần Thơ',
    'Hải Phòng',
    'Vũng Tàu',
    'Huế'
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (jobTitle.trim()) {
      params.set('jobTitle', jobTitle.trim());
    }
    if (location) {
      params.set('location', location);
    }

    // Navigate to job listing page with search parameters
    router.push(`/job?${params.toString()}`);

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(jobTitle.trim(), location);
    }
  };

  const handlePopularTagClick = (tag: string) => {
    setJobTitle(tag);
    handleSearch();
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Find your <span className="text-blue-500 relative">
                dream job
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></div>
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-6">
              Find your next career at companies like HubSpot, Nike, and Dropbox
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-lg p-2">
              {/* Job Title Search */}
              <div className="flex-1 relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 border-0"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-2"></div>

              {/* Location Dropdown */}
              <div className="relative md:w-80">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center">
                    <span>{location}</span>
                  </div>
                </button>

                {isLocationOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                    <div className="p-2">
                      {cities.map((city, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => {
                            setLocation(city);
                            setIsLocationOpen(false);
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mt-8 text-center">
              <span className="text-gray-600 mr-4">Popular:</span>
              {popularTags.map((tag, index) => (
                <span key={index}>
                  <button
                    onClick={() => handlePopularTagClick(tag)}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {tag}
                  </button>
                  {index < popularTags.length - 1 && (
                    <span className="text-gray-400 mx-2">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJob;