'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox, Label } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Skill, SkillResponse } from '@/types/skill';
import api from '@/services/api';

interface FilterState {
  employmentTypes: string[];
  skills: string[];
  jobLevels: string[];
  salaryRanges: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

interface JobFilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ onFilterChange }) => {
    const [skill, setSkill] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    employmentTypes: [],
    skills: [], // Pre-selected as shown in image
    jobLevels: [],
    salaryRanges: []
  });

  const [openSections, setOpenSections] = useState({
    employmentType: true,
    skills: true,
    jobLevel: true,
    salaryRange: true
  });

  useEffect(() => {
    const fetchSkill = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<SkillResponse>('/skills');
            setSkill(response.data.data.result);
            console.log('Skills fetched:', response.data.data.result);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            console.error('Fetch skills error:', err.response?.data || err.message);
          } finally {
            setLoading(false);
          }
    };
    fetchSkill();
  }, [])

  const employmentTypes: FilterOption[] = [
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'FRESHER', label: 'Fresher' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MIDDLE', label: 'Middle' },
    { value: 'SENIOR', label: 'Senior' }
  ];

  const skills: FilterOption[] = skill.map((s) => ({
    value: s.name,
    label: s.name,
  }));


  const salaryRanges: FilterOption[] = [
    { value: '$700 - $1000', label: '$700 - $1000' },
    { value: '$100 - $1500', label: '$100 - $1500'},
    { value: '$1500 - $2000', label: '$1500 - $2000' },
    { value: '$3000 or above', label: '$3000 or above' }
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: checked
        ? [...filters[filterType], value]
        : filters[filterType].filter(item => item !== value)
    };
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const FilterSection: React.FC<{
    title: string;
    sectionKey: keyof typeof openSections;
    options: FilterOption[];
    filterType: keyof FilterState;
  }> = ({ title, sectionKey, options, filterType }) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Icon
          icon={openSections[sectionKey] ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-5 h-5 text-gray-600"
        />
      </button>
      
      {openSections[sectionKey] && (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <Checkbox
                id={`${filterType}-${option.value}`}
                checked={filters[filterType].includes(option.value)}
                onChange={(e) => handleFilterChange(filterType, option.value, e.target.checked)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor={`${filterType}-${option.value}`}
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
      </div>

      <FilterSection
        title="Type of Employment"
        sectionKey="employmentType"
        options={employmentTypes}
        filterType="employmentTypes"
      />

      <FilterSection
        title="Skills"
        sectionKey="skills"
        options={skills}
        filterType="skills"
      />

      <FilterSection
        title="Salary Range"
        sectionKey="salaryRange"
        options={salaryRanges}
        filterType="salaryRanges"
      />

      <button
        onClick={() => {
          const emptyFilters = {
            employmentTypes: [],
            skills: [],
            jobLevels: [],
            salaryRanges: []
          };
          setFilters(emptyFilters);
          onFilterChange?.(emptyFilters);
        }}
        className="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default JobFilter;