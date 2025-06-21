'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto  px-4 py-12">
                <div className="grid grid-cols-1  md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-400">JobFinder</h3>
                        <p className="text-gray-400">
                            Nền tảng tìm kiếm việc làm hàng đầu Việt Nam, kết nối nhà tuyển dụng và ứng viên.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-400 ">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/jobs" className="text-gray-400 hover:text-white">
                                    Tìm việc
                                </Link>
                            </li>
                            <li>
                                <Link href="/companies" className="text-gray-400 hover:text-white">
                                    Công ty
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-400">Dành cho nhà tuyển dụng</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/employer/register" className="text-gray-400 hover:text-white">
                                    Đăng ký tài khoản
                                </Link>
                            </li>
                            <li>
                                <Link href="/employer/post-job" className="text-gray-400 hover:text-white">
                                    Đăng tin tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/employer/pricing" className="text-gray-400 hover:text-white">
                                    Bảng giá
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-400">Liên hệ</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                123 Đường ABC, Quận 1, TP.HCM
                            </li>
                            <li className="text-gray-400">
                                <i className="fas fa-phone mr-2"></i>
                                (84) 123-456-789
                            </li>
                            <li className="text-gray-400">
                                <i className="fas fa-envelope mr-2"></i>
                                contact@jobfinder.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JobFinder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 