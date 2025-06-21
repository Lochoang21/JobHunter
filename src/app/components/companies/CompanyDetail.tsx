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
            <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full p-10">
                <DrawerHeader title="CompanyDetail" />
                <DrawerItems>
                    {company ? (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="relative w-32 h-32">
                                    <img
                                        src={getImageUrl(company.logo)}
                                        alt={company.name}
                                        className="w-full h-full object-contain rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/logos/companies-icon.jpg';
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label value="ID" className="font-semibold" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">:   {company.id}</span>
                            </div>
                            <div>
                                <Label value="Name" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{company.name}</p>
                            </div>
                            <div>
                                <Label value="Address" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.address || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Description" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.description || "N/A"}
                                </p>
                            </div>

                            <div>
                                <Label value="Created At" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.createAt
                                        ? new Date(company.createAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Create By" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.createBy || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Update At" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.updateAt
                                        ? new Date(company.updateAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Update By" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.updateBy || "N/A"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No user selected
                        </p>
                    )}
                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <Button color="gray" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DrawerItems>
            </Drawer>
        </>
    );
}
export default CompanyDetail;