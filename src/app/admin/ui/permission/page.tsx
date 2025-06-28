"use client";
import React from 'react';
import PermissionTable from '@/app/components/permissions/PermissionTable';

const PermissionPage = () => {
    return (
        <div className="container mx-auto p-4">
            <PermissionTable />
        </div>
    );
};

export default PermissionPage;