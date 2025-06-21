// src/app/page.tsx

import React from 'react';
import CompanyListing from '@/components/companies/CompanyListing';

export default function JobPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <CompanyListing/>
     
    </div>
  );
}