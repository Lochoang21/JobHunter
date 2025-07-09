'use client';

import React from 'react';
import { Carousel } from 'flowbite-react';
import Link from 'next/link';

const HeroSection = () => {
    const banners = [
        {
            id: 1,
            title: "Tìm kiếm công việc mơ ước của bạn",
            subtitle: "Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu",
            background: "bg-gradient-to-r from-blue-300 to-blue-400", // Xanh dương nhạt
            image: "/api/placeholder/800/400" // Placeholder cho hình ảnh
        },
        {
            id: 2,
            title: "Kết nối với các nhà tuyển dụng hàng đầu",
            subtitle: "Gặp gỡ trực tiếp với HR và hiring manager từ các công ty lớn",
            background: "bg-gradient-to-r from-blue-500 to-blue-600", // Xanh dương trung bình
            image: "/api/placeholder/800/400"
        },
        {
            id: 3,
            title: "Phát triển sự nghiệp cùng chúng tôi",
            subtitle: "Nhận tư vấn nghề nghiệp và định hướng phát triển từ chuyên gia",
            background: "bg-gradient-to-r from-blue-700 to-blue-800", // Xanh dương đậm
            image: "/api/placeholder/800/400"
        },
        {
            id: 4,
            title: "Mức lương hấp dẫn đang chờ bạn",
            subtitle: "Cập nhật thông tin lương thưởng minh bạch từ các doanh nghiệp uy tín",
            background: "bg-gradient-to-r from-blue-900 to-blue-950", // Xanh dương rất đậm
            image: "/api/placeholder/800/400"
        }
    ];

    return (
        <div className="h-96 md:h-[500px]">
            <Carousel
                slideInterval={5000}
                pauseOnHover
                indicators={true}
                leftControl={
                    <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-full hover:bg-white/50 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                }
                rightControl={
                    <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-full hover:bg-white/50 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                }
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className={`relative h-full ${banner.background} flex items-center justify-center text-white`}
                    >
                        {/* Background overlay */}
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Content */}
                        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in text-white">
                                {banner.title}
                            </h1>
                            <p className="text-lg text-gray-300 md:text-xl mb-8 animate-fade-in-delay">
                                {banner.subtitle}
                            </p>

                            {/* Call to action buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    <Link href={'/job'} >
                                        Tìm việc ngay 
                                    </Link>
                                </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
                                
                                <Link href={'/subscriber'} >
                                Đăng ký CV
                                    </Link>
                            </button>
                        </div>
                    </div>

                        {/* Decorative elements */ }
                    < div className = "absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent" ></div>

                        {/* Optional: Add some floating elements for visual appeal */ }
                        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-slow hidden lg:block"></div>
                        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse hidden lg:block"></div>
                    </div >
                ))}
            </Carousel >

    {/* Custom CSS for animations */ }
    < style jsx > {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-delay {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
                
                .animate-fade-in-delay {
                    animation: fade-in-delay 0.8s ease-out 0.2s both;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite;
                }
            `}</style >
        </div >
    );
};

export default HeroSection;