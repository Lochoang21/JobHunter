// src/app/page.tsx

import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobListing from '@/components/jobs/JobListing';

export default function JobPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        <JobListing />
      </Suspense>
    </div>
  );
}