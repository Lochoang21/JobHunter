'use client';
import React from 'react';
import { Job } from '@/types/job';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Cookies from 'js-cookie';

const ApplyJob: React.FC<{ job: Job }> = ({ job }) => {

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, userEmail, isAuthenticated } = useCurrentUser();

  // Set email from current user if available
  React.useEffect(() => {
    if (userEmail && !email) {
      setEmail(userEmail);
    }
  }, [userEmail, email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để ứng tuyển');
      return;
    }

    if (!email || !selectedFile) {
      setError('Vui lòng nhập email và chọn file CV');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get JWT token from cookies
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      // Step 1: Upload file to backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'resumes');

      console.log('Uploading file:', selectedFile.name);

      const uploadResponse = await fetch('http://localhost:8080/api/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        // Note: Don't set Content-Type header for FormData, browser will set it automatically
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload response:', uploadResult);

      // Extract fileName from the response
      const fileName = uploadResult.data.fileName;

      if (!fileName) {
        throw new Error('Không nhận được tên file từ server');
      }

      // Step 2: Create resume with uploaded file
      const resumeData = {
        email: email,
        url: fileName,
        user: { id: user?.id },
        job: { id: job.id }
      };

      console.log('Creating resume with data:', resumeData);

      const resumeResponse = await fetch('http://localhost:8080/api/v1/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(resumeData),
      });

      if (!resumeResponse.ok) {
        const errorData = await resumeResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Create resume failed with status: ${resumeResponse.status}`);
      }

      const resumeResult = await resumeResponse.json();
      console.log('Resume created:', resumeResult);

      // Success
      setOpenModal(false);
      setEmail('');
      setSelectedFile(null);
      alert('Ứng tuyển thành công!');

    } catch (err: any) {
      console.error('Error during application:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Logo and Job Details */}
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={`${job.company?.name || 'Company'} logo`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            job.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.name}</h3>
          <p className="text-sm text-gray-500">
            {job.company?.name || 'Unknown Company'} • {job.location || 'No location'} • {job.level}
          </p>
        </div>
      </div>

      {/* Share Icon and Apply Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Open Modal to apply job */}
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Apply for {job.name}</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {!isAuthenticated && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Vui lòng đăng nhập để ứng tuyển công việc này.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload Resume/CV" />
              </div>
              <input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={!isAuthenticated}
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={handleSubmit}
            disabled={isSubmitting || !isAuthenticated}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Submit Application'}
          </Button>
          <Button
            color="alternative"
            onClick={() => setOpenModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ApplyJob;