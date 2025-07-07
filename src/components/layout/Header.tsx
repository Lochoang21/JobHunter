'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriber } from '@/contexts/SubscriberContext';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { user, logout } = useAuth();
    const { isSubscriber } = useSubscriber();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-primary">
                        JobFinder
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/job" className="text-gray-600 hover:text-primary">
                            Tìm việc
                        </Link>
                        <Link href="/company" className="text-gray-600 hover:text-primary">
                            Công ty
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-primary">
                            Về chúng tôi
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="text-gray-600 hover:text-primary">
                                    Hồ sơ
                                </Link>
                                <Link href="/subscriber" className="text-gray-600 hover:text-primary">
                                    {isSubscriber ? '📧 Đã đăng ký' : '📧 Đăng ký thông báo'}
                                </Link>
                                <Button color="primary" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/login">
                                    <Button color="light">Đăng nhập</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button color="primary">Đăng ký</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 space-y-4">
                        <Link
                            href="/jobs"
                            className="block text-gray-600 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Tìm việc
                        </Link>
                        <Link
                            href="/companies"
                            className="block text-gray-600 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Công ty
                        </Link>
                        <Link
                            href="/about"
                            className="block text-gray-600 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Về chúng tôi
                        </Link>
                        {user ? (
                            <div className="space-y-4">
                                <Link
                                    href="/profile"
                                    className="block text-gray-600 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Hồ sơ
                                </Link>
                                <Link
                                    href="/subscriber"
                                    className="block text-gray-600 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {isSubscriber ? '📧 Đã đăng ký' : '📧 Đăng ký thông báo'}
                                </Link>
                                <Button color="primary" onClick={handleLogout} className="w-full">
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Link href="/login" className="block">
                                    <Button color="light" className="w-full">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/register" className="block">
                                    <Button color="primary" className="w-full">
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header; 