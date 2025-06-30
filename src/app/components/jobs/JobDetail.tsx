"use client";
import React from "react";
import { Drawer, DrawerHeader, DrawerItems, Label, Badge, Button } from "flowbite-react";
import { Job } from "@/types/job";

interface JobDetailProps {
  job: Job | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full">
      <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
        <DrawerHeader title="Job Details" className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm" />
        <DrawerItems className="p-0">
          {job ? (
            <div className="p-6 space-y-6">
              {/* Job Header Section */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.001" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.name || "Untitled Job"}
                </h2>
                <div className="flex justify-center space-x-2">
                  <Badge color="indigo" size="sm">
                    ID: {job.id}
                  </Badge>
                  <Badge color={job.active ? "indigo" : "failure"} size="sm">
                    {job.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Job Information Cards */}
              <div className="space-y-4">
                {/* Basic Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Location</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {job.location || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Quantity</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {job.quantity || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Level</span>
                      <div className="mt-1">
                        {job.level ? (
                          <Badge color="purple" size="sm">{job.level}</Badge>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Company</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {job.company?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Salary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label value="Salary" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block" />
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {job.salary ? `${job.salary.toLocaleString()} VND` : "Negotiable"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label value="Description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {job.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label value="Required Skills" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block" />
                      {job.skills && job.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill.id} color="purple" size="sm">
                              {skill.name || "N/A"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No specific skills required</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Start Date</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {job.staterDate ? new Date(job.staterDate).toLocaleDateString() : "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">End Date</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {job.endDate ? new Date(job.endDate).toLocaleDateString() : "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">System Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Created At</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {job.createAt ? new Date(job.createAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Created By</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {job.createBy || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Updated At</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {job.updateAt ? new Date(job.updateAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block">Updated By</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {job.updateBy || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.001" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No job selected</p>
            </div>
          )}
          
          {/* Action Button */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Button 
              color="gray" 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </Button>
          </div>
        </DrawerItems>
      </div>
    </Drawer>
  );
};

export default JobDetail;