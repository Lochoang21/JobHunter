'use client';
import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchJobProps {
  onSearch?: (jobTitle: string, location: string) => void;
}

const SearchJob: React.FC<SearchJobProps> = ({ onSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobTitle, setJobTitle] = useState(searchParams.get('jobTitle') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const popularTags = ['UI Designer', 'UX Researcher', 'Android', 'Admin'];

  // Tạo filter giống JobTable
  const buildFilter = useCallback((title: string, loc: string) => {
    let filters: string[] = [];
    if (title.trim()) {
      filters.push(`name~'${title.trim()}'`);
    }
    if (loc.trim()) {
      filters.push(`location~'${loc.trim()}'`);
    }
    return filters.join(';');
  }, []);

  const handleSearch = useCallback((titleOverride?: string, locationOverride?: string) => {
    // Sử dụng giá trị override nếu có, nếu không thì dùng state hiện tại
    const currentTitle = titleOverride !== undefined ? titleOverride : jobTitle;
    const currentLocation = locationOverride !== undefined ? locationOverride : location;
    
    const filter = buildFilter(currentTitle, currentLocation);
    const params = new URLSearchParams();
    if (filter) {
      params.set('filter', filter);
    }
    router.push(`/job?${params.toString()}`);
    if (onSearch) {
      onSearch(currentTitle.trim(), currentLocation.trim());
    }
  }, [jobTitle, location, buildFilter, router, onSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Truyền trực tiếp giá trị hiện tại để tránh timing issue
    handleSearch(jobTitle, location);
  };

  const handlePopularTagClick = (tag: string) => {
    setJobTitle(tag);
    // Sử dụng callback để đảm bảo search được thực hiện với giá trị mới
    setTimeout(() => handleSearch(tag, location), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(jobTitle, location);
    }
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
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-lg p-2"
            >
              {/* Job Title Search */}
              <div className="flex-1 relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 border-0"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-2"></div>

              {/* Location Input */}
              <div className="flex-1 relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Location (e.g. Ho Chi Minh, Ha Noi...)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 border-0"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </form>

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