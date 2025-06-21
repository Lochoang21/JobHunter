import React, { useEffect, useState } from 'react';
import { Company } from '@/types/company';
import api from '@/services/api';

// Add custom styles for rich text content
const richTextStyles = `
  .rich-text-content h1 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0 0.5rem 0; }
  .rich-text-content h2 { font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0 0.5rem 0; }
  .rich-text-content h3 { font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0 0.25rem 0; }
  .rich-text-content p { margin: 0.5rem 0; line-height: 1.6; }
  .rich-text-content ul, .rich-text-content ol { margin: 0.5rem 0; padding-left: 1.5rem; }
  .rich-text-content li { margin: 0.25rem 0; }
  .rich-text-content strong { font-weight: bold; }
  .rich-text-content em { font-style: italic; }
  .rich-text-content u { text-decoration: underline; }
  .rich-text-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
  .rich-text-content code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
  .rich-text-content pre { background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
  .rich-text-content a { color: #3b82f6; text-decoration: underline; }
  .rich-text-content a:hover { color: #1d4ed8; }
`;

interface CompanyDetailProps {
  companyId: string | number;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyId }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`companies/${companyId}`);
        setCompany(response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch company");
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchCompany();
  }, [companyId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công ty...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Company not found
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-2 8h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy công ty</h2>
          <p className="text-gray-600 mb-4">Công ty bạn đang tìm kiếm không tồn tại.</p>
          <a
            href="/companies"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách công ty
          </a>
        </div>
      </div>
    );
  }

  // Mock data - replace with actual API calls
  const techStack = [
    { name: 'HTML 5', icon: '🟠', color: 'bg-orange-100' },
    { name: 'CSS 3', icon: '🔵', color: 'bg-blue-100' },
    { name: 'JavaScript', icon: '🟡', color: 'bg-yellow-100' },
    { name: 'Ruby', icon: '🔴', color: 'bg-red-100' },
    { name: 'Mixpanel', icon: '🟣', color: 'bg-purple-100' },
    { name: 'Framer', icon: '⚫', color: 'bg-gray-100' },
  ];

  const officeLocations = [
    { country: 'United States', flag: '🇺🇸' },
    { country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { country: 'Japan', flag: '🇯🇵' },
    { country: 'Australia', flag: '🇦🇺' },
    { country: 'China', flag: '🇨🇳' },
  ];

  const socialLinks = company ? [
    { name: 'Twitter', url: `https://twitter.com/${company.name.toLowerCase()}`, icon: '🐦' },
    { name: 'Facebook', url: `https://facebook.com/${company.name}HQ`, icon: '📘' },
    { name: 'LinkedIn', url: `https://linkedin.com/company/${company.name.toLowerCase()}`, icon: '💼' },
  ] : [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inject custom styles for rich text */}
      <style dangerouslySetInnerHTML={{ __html: richTextStyles }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <span>Home</span> / <span>Companies</span> / <span className="text-gray-900">{company?.name || 'Loading...'}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0">
                  {company.logo && !company.logo.includes('undefined') ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold text-gray-900">{company.name}</h1>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {company.jobCount || Math.floor(Math.random() * 50) + 1} Jobs
                    </span>
                  </div>

                  <div className="text-blue-600 text-lg mb-6">
                    https://{company.name.toLowerCase()}.com
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">📅</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Founded</div>
                        <div className="font-semibold">{formatDate(company.createAt)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">👥</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Employees</div>
                        <div className="font-semibold">4000+</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">📍</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-semibold">{company.address || 'Multiple locations'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">🏢</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Industry</div>
                        <div className="font-semibold">Payment Gateway</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Profile */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h2>
              {company.description ? (
                <div
                  className="rich-text-content prose max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              ) : (
                <div className="prose max-w-none text-gray-600 leading-relaxed">
                  <p>
                    {`${company.name} is a software platform for starting and running internet businesses. Millions of businesses rely on ${company.name}'s software tools to accept payments, expand globally, and manage their businesses online. ${company.name} has been at the forefront of expanding internet commerce, powering new business models, and supporting the latest platforms, from marketplaces to mobile commerce sites.`}
                  </p>
                  <p className="mt-4">
                    We believe that growing the GDP of the internet is a problem rooted in code and design, not finance. {company.name} is built for developers, makers, and creators. We work on solving the hard technical problems necessary to build global economic infrastructure—from designing highly reliable systems to developing advanced machine learning algorithms to prevent fraud.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>{social.icon}</span>
                    <span className="text-sm">{social.url}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Office Photos */}
            {/* <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Office space"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="/api/placeholder/300/300"
                      alt="Team meeting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="/api/placeholder/300/300"
                      alt="Collaboration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="/api/placeholder/300/300"
                      alt="Team celebration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Tech Stack & Locations */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tech stack</h3>
              <p className="text-gray-600 text-sm mb-6">
                Learn about the technology and tools that {company.name} uses.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 rounded-lg ${tech.color} flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-lg">{tech.icon}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-700">{tech.name}</div>
                  </div>
                ))}
              </div>

              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                View tech stack →
              </a>
            </div>

            {/* Office Locations */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Office Location</h3>
              <p className="text-gray-600 text-sm mb-6">
                {company.name} offices spread across 20 countries
              </p>

              <div className="space-y-4 mb-6">
                {officeLocations.map((location, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-lg">{location.flag}</span>
                    <span className="font-medium text-gray-900">{location.country}</span>
                  </div>
                ))}
              </div>

              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                View countries →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;