import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import JobCategories from '@/components/home/JobCategories';
import CompanyCategories from '@/components/home/CompanyCategories';
import ListJob from '@/components/home/ListJob';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <CompanyCategories />
            <JobCategories />
            <ListJob />
        </>
    );
} 