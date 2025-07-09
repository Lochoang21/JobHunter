'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import JobFilter from './JobFilter';
import SearchJob from './SearchJob';
import CardJob from './CardJob';
import api from '@/services/api';
import { Job, JobResponse } from '@/types/job';
import { Pagination } from 'flowbite-react';

interface FilterState {
  employmentTypes: string[];
  skills: string[];
  jobLevels: string[];
  salaryRanges: string[];
}

const JobListing: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, pageSize: 6, pages: 1, total: 0 });
  const [filters, setFilters] = useState<FilterState>({
    employmentTypes: [],
    skills: [],
    jobLevels: [],
    salaryRanges: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Parse search parameters from URL
  const searchJobTitle = searchParams.get('jobTitle') || '';
  const searchLocation = searchParams.get('location') || '';
  const urlFilter = searchParams.get('filter') || '';

  // Parse URL filter string to extract search terms
  const parseUrlFilter = useCallback((filterString: string) => {
    let jobTitle = '';
    let location = '';
    
    if (filterString) {
      const titleMatch = filterString.match(/name~'([^']+)'/);
      const locationMatch = filterString.match(/location~'([^']+)'/);
      
      if (titleMatch) jobTitle = titleMatch[1];
      if (locationMatch) location = locationMatch[1];
    }
    
    return { jobTitle, location };
  }, []);

  // Get current search terms from URL
  const currentSearchTerms = useMemo(() => {
    if (urlFilter) {
      return parseUrlFilter(urlFilter);
    }
    return { jobTitle: searchJobTitle, location: searchLocation };
  }, [urlFilter, searchJobTitle, searchLocation, parseUrlFilter]);

  // Build filter string for API
  const buildFilterString = useCallback((jobTitle: string, location: string) => {
    const filters = [];
    
    if (jobTitle.trim()) {
      filters.push(`name~'${jobTitle.trim()}'`);
    }
    
    if (location.trim()) {
      filters.push(`location~'${location.trim()}'`);
    }
    
    return filters.length > 0 ? filters.join(' AND ') : '';
  }, []);

  // Fetch jobs from API
  const fetchJobs = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const { jobTitle, location } = currentSearchTerms;
      const filterString = buildFilterString(jobTitle, location);

      const params: any = {
        page: page,
        size: jobsPerPage
      };

      if (filterString) {
        params.filter = filterString;
      }

      const response = await api.get<JobResponse>('/jobs', { params });
      setJobs(response.data.data.result);
      setMeta(response.data.data.meta);
      console.log('Jobs fetched:', response.data.data.result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      console.error('Fetch jobs error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [currentSearchTerms, buildFilterString, jobsPerPage]);

  // Handle search from SearchJob component
  const handleSearch = useCallback((jobTitle: string, location: string) => {
    const filterString = buildFilterString(jobTitle, location);
    const params = new URLSearchParams();
    
    if (filterString) {
      params.set('filter', filterString);
    }
    
    // Update URL and reset to page 1
    router.push(`/job?${params.toString()}`);
    setCurrentPage(1);
  }, [buildFilterString, router]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Fetch jobs when URL parameters change
  useEffect(() => {
    setCurrentPage(1);
    fetchJobs(1);
  }, [fetchJobs]);

  // Fetch jobs when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchJobs(currentPage);
    }
  }, [currentPage, fetchJobs]);

  // Mapping functions for filters
  const mapJobLevel = (filterLevel: string): string[] => {
    const levelMap: { [key: string]: string[] } = {
      'Entry Level': ['INTERNSHIP', 'FRESHER'],
      'Mid Level': ['JUNIOR', 'MIDDLE'],
      'Senior Level': ['SENIOR'],
      'Director': ['SENIOR'],
      'VP or Above': ['SENIOR'],
    };
    return levelMap[filterLevel] || [];
  };

  const mapSalaryRange = useCallback((salary: number | null): boolean => {
    if (!salary || filters.salaryRanges.length === 0) return filters.salaryRanges.length === 0;

    const salaryInUSD = salary / 24000;

    return filters.salaryRanges.some((range) => {
      switch (range) {
        case '$700 - $1000':
          return salaryInUSD >= 700 && salaryInUSD <= 1000;
        case '$100 - $1500':
          return salaryInUSD >= 100 && salaryInUSD <= 1500;
        case '$1500 - $2000':
          return salaryInUSD >= 1500 && salaryInUSD <= 2000;
        case '$3000 or above':
          return salaryInUSD >= 3000;
        default:
          return false;
      }
    });
  }, [filters.salaryRanges]);

  // Apply client-side filters
  const filteredJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs.filter((job) => {
      // Employment Type filter
      if (filters.employmentTypes.length > 0) {
        if (!filters.employmentTypes.includes(job.level || '')) {
          return false;
        }
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const jobSkillNames = job.skills.map((skill) => skill.name);
        const hasSkill = filters.skills.some((filterSkill) =>
          jobSkillNames.includes(filterSkill)
        );
        if (!hasSkill) {
          return false;
        }
      }

      // Job Level filter
      if (filters.jobLevels.length > 0) {
        const jobLevels = filters.jobLevels.flatMap(mapJobLevel);
        if (!jobLevels.includes(job.level || '')) {
          return false;
        }
      }

      // Salary Range filter
      if (filters.salaryRanges.length > 0) {
        if (!mapSalaryRange(job.salary)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters, mapSalaryRange]);

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which pagination to show
  const hasActiveFilters = filters.employmentTypes.length > 0 ||
                          filters.skills.length > 0 ||
                          filters.jobLevels.length > 0 ||
                          filters.salaryRanges.length > 0;

  const showPagination = hasActiveFilters ? totalFilteredPages > 1 : meta.pages > 1;
  const totalPages = hasActiveFilters ? totalFilteredPages : meta.pages;
  const displayJobs = hasActiveFilters ? paginatedJobs : jobs;

  // Reset filters
  const resetFilters = () => {
    setFilters({
      employmentTypes: [],
      skills: [],
      jobLevels: [],
      salaryRanges: [],
    });
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearchJob onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filter Sidebar Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="space-y-1">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded mb-4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-100 rounded"></div>
                      <div className="h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                ))}
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
      <div className="min-h-screen bg-gray-50">
        <SearchJob onSearch={handleSearch} />
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
      <SearchJob onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="flex-shrink-0">
            <JobFilter onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Danh sách <span className="text-blue-500">việc làm</span>
              </h1>
              <p className="text-gray-600 text-lg">Tìm kiếm cơ hội việc làm phù hợp với bạn</p>

              {/* Search Results Summary */}
              {(currentSearchTerms.jobTitle || currentSearchTerms.location) && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Kết quả tìm kiếm:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentSearchTerms.jobTitle && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Tên công việc: {currentSearchTerms.jobTitle}
                      </span>
                    )}
                    {currentSearchTerms.location && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Địa điểm: {currentSearchTerms.location}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Hiển thị{' '}
                  <span className="font-semibold">
                    {hasActiveFilters ? filteredJobs.length : Math.min(currentPage * jobsPerPage, meta.total)}
                  </span>{' '}
                  trong số <span className="font-semibold">{hasActiveFilters ? filteredJobs.length : meta.total}</span> việc làm
                </span>
                {hasActiveFilters && (
                  <span className="text-sm text-blue-600">(Kết quả đã lọc)</span>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Bộ lọc đang áp dụng:</h3>
                <div className="flex flex-wrap gap-2">
                  {[...filters.employmentTypes, ...filters.skills, ...filters.jobLevels, ...filters.salaryRanges].map(
                    (filter, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {filter}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Job Cards Grid */}
            {jobs.length === 0 ? (
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Hiện tại chưa có việc làm nào
                </h3>
                <p className="text-gray-500">Vui lòng quay lại sau để xem thêm cơ hội việc làm mới!</p>
              </div>
            ) : displayJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
                  {displayJobs.map((job) => (
                    <CardJob key={job.id} job={job} />
                  ))}
                </div>
                {/* Pagination */}
                {showPagination && (
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
            ) : (
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy việc làm phù hợp
                </h3>
                <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;