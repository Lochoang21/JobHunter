'use client';

import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Tìm kiếm công việc mơ ước của bạn
                    </h1>
                    <p className="text-xl mb-8">
                        Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <TextInput
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm (ví dụ: Frontend Developer, Marketing...)"
                            className="flex-grow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" color="light" className="w-full md:w-auto">
                            Tìm kiếm
                        </Button>
                    </form>

                    {/* Popular Searches */}
                    <div className="mt-6">
                        <p className="text-sm text-gray-200 mb-2">Tìm kiếm phổ biến:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Frontend Developer', 'Backend Developer', 'Marketing', 'Sales', 'HR'].map(
                                (tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                                    >
                                        {tag}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection; 