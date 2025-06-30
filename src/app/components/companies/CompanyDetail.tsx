"use client";
import React from "react";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Badge } from "flowbite-react";
import { Company } from "@/types/company";
import Image from 'next/image';

interface CompanyDetailProps {
    company: Company | null;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({
    company, isOpen, onOpen, onClose,
}) => {
    // Function to ensure image URL is absolute and includes auth token
    const getImageUrl = (url: string | undefined | null): string => {
        if (!url) return '/images/logos/companies-icon.jpg';

        if (url.startsWith('http')) {
            return url;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const token = localStorage.getItem('token'); // Get auth token from localStorage
        const separator = url.includes('?') ? '&' : '?';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}${token ? `${separator}token=${token}` : ''}`;
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full">
                <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
                    <DrawerHeader title="Company Details" className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm" />
                    <DrawerItems className="p-0">
                        {company ? (
                            <div className="p-6 space-y-6">
                                {/* Company Logo Section */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-blue-100 dark:border-blue-900 dark:bg-gray-800 overflow-hidden">
                                            <img
                                                src={getImageUrl(company.logo)}
                                                alt={company.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/logos/companies-icon.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                    </div>
                                </div>

                                {/* Company Name */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {company.name}
                                    </h2>
                                    <Badge color="blue" size="sm" className="inline-flex">
                                        ID: {company.id}
                                    </Badge>
                                </div>

                                {/* Company Information Cards */}
                                <div className="space-y-4">
                                    {/* Address Card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label value="Address" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {company.address || "No address provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label value="Description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {company.description || "No description available"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metadata Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                                                <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Information</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">Created At</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {company.createAt ? new Date(company.createAt).toLocaleDateString() : "N/A"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">Created By</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {company.createBy || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">Updated At</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {company.updateAt ? new Date(company.updateAt).toLocaleDateString() : "N/A"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">Updated By</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {company.updateBy || "N/A"}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No company selected</p>
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
        </>
    );
}

export default CompanyDetail;