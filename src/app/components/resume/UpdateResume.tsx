"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Alert, Badge } from "flowbite-react";
import api from "@/services/api";
import { Resume, ResumeStatusEnum } from "@/types/resume";
import {
    HiUser,
    HiMail,
    HiOfficeBuilding,
    HiBriefcase,
    HiCalendar,
    HiDownload,
    HiDocumentText,
    HiRefresh,
    HiCheckCircle,
    HiExclamationCircle,
    HiClock,
    HiEye
} from "react-icons/hi";

interface UpdateResumeProps {
    resume: Resume | null;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateResume: React.FC<UpdateResumeProps> = ({ resume, isOpen, onClose }) => {
    const [status, setStatus] = useState<ResumeStatusEnum>(ResumeStatusEnum.PENDING);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Update status when resume changes
    useEffect(() => {
        if (resume) {
            setStatus(resume.status);
        }
    }, [resume]);

    const handleSubmit = async () => {
        if (!resume) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.put("/resumes", {
                id: resume.id,
                status: status
            });

            setSuccess("Trạng thái hồ sơ đã được cập nhật thành công!");

            // Dispatch custom event to refresh table
            const refreshTableEvent = new Event("refreshResumeTable");
            window.dispatchEvent(refreshTableEvent);

            // Close modal after success
            setTimeout(() => {
                onClose();
                setSuccess(null);
            }, 1500);

        } catch (err: any) {
            setError(err.response?.data?.message || "Không thể cập nhật trạng thái hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(null);
        setLoading(false);
        onClose();
    };

    const getStatusBadge = (status: ResumeStatusEnum) => {
        const statusConfig = {
            [ResumeStatusEnum.PENDING]: { color: "warning", label: "Đang chờ", icon: HiClock },
            [ResumeStatusEnum.REVIEWING]: { color: "purple", label: "Đang xem xét", icon: HiEye },
            [ResumeStatusEnum.APPROVED]: { color: "green", label: "Được chấp nhận", icon: HiCheckCircle },
            [ResumeStatusEnum.REJECTED]: { color: "failure", label: "Bị từ chối", icon: HiExclamationCircle },
        };
        const config = statusConfig[status] || { color: "gray", label: status, icon: HiClock };
        const IconComponent = config.icon;

        return (
            <Badge color={config.color as any} size="sm" className="px-5">
                <span className="flex items-center gap-1">
                    <IconComponent className="h-3 w-3" />
                    {config.label}
                </span>
            </Badge>


        );
    };

    const getStatusDescription = (status: ResumeStatusEnum) => {
        const descriptions = {
            [ResumeStatusEnum.PENDING]: "Hồ sơ đã được nộp, đang chờ xem xét",
            [ResumeStatusEnum.REVIEWING]: "Hồ sơ đang được HR xem xét và đánh giá",
            [ResumeStatusEnum.APPROVED]: "Hồ sơ được chấp nhận, ứng viên sẽ được liên hệ",
            [ResumeStatusEnum.REJECTED]: "Hồ sơ không phù hợp với vị trí tuyển dụng"
        };
        return descriptions[status] || "Không có mô tả";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const hasStatusChanged = status !== resume?.status;

    return (
        <Modal show={isOpen} onClose={handleClose} size="2xl">
            <Modal.Header className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3">
                    <HiRefresh className="h-6 w-6 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Cập nhật trạng thái hồ sơ
                        </h3>
                        <p className="text-sm text-gray-500">ID: #{resume?.id}</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="p-0">
                {resume && (
                    <div className="max-h-96 overflow-y-auto">
                        {/* Alert Messages */}
                        {(error || success) && (
                            <div className="p-6 border-b border-gray-100">
                                {error && (
                                    <Alert color="failure" className="mb-3">
                                        <span>{error}</span>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert color="success">
                                        <span>{success}</span>
                                    </Alert>
                                )}
                            </div>
                        )}

                        <div className="p-6 space-y-6">
                            {/* Resume Information Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                    <HiDocumentText className="h-5 w-5 text-blue-600 mr-2" />
                                    Thông tin hồ sơ ứng tuyển
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <HiUser className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700 w-16">Tên:</span>
                                            <span className="text-gray-900">{resume.user.name}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <HiMail className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700 w-16">Email:</span>
                                            <span className="text-gray-900">{resume.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <HiBriefcase className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700 w-20">Vị trí:</span>
                                            <span className="text-gray-900">{resume.job.name}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <HiOfficeBuilding className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700 w-20">Công ty:</span>
                                            <span className="text-gray-900">{resume.companyName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Status */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                    <HiCheckCircle className="h-5 w-5 text-gray-600 mr-2" />
                                    Trạng thái hiện tại
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col space-y-1 w-80">
                                        {getStatusBadge(resume.status)}
                                        <span className="text-sm text-gray-600">
                                            {getStatusDescription(resume.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <HiCalendar className="h-4 w-4 mr-1" />
                                        {formatDate(resume.createAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Status Update Form */}
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                    <HiRefresh className="h-5 w-5 text-yellow-600 mr-2" />
                                    Cập nhật trạng thái
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái mới
                                        </label>
                                        <Select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as ResumeStatusEnum)}
                                            disabled={loading}
                                            className="w-full"
                                        >
                                            <option value={ResumeStatusEnum.PENDING}>Đang chờ duyệt</option>
                                            <option value={ResumeStatusEnum.REVIEWING}>Đang xem xét</option>
                                            <option value={ResumeStatusEnum.APPROVED}>Được chấp nhận</option>
                                            <option value={ResumeStatusEnum.REJECTED}>Bị từ chối</option>
                                        </Select>
                                    </div>

                                    {/* Status Preview */}
                                    {hasStatusChanged && (
                                        <div className="bg-white rounded border-2 border-dashed border-yellow-300 p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Trạng thái sau khi cập nhật:</span>
                                                {getStatusBadge(status)}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {getStatusDescription(status)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resume File */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                    <HiDocumentText className="h-5 w-5 text-purple-600 mr-2" />
                                    Tệp hồ sơ đính kèm
                                </h4>
                                <div className="flex items-center justify-between bg-white rounded border p-3">
                                    <div className="flex items-center">
                                        <HiDocumentText className="h-8 w-8 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {resume.url}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tệp CV của ứng viên
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:8080/storage/resumes/${resume.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors duration-200"
                                    >
                                        <HiDownload className="h-4 w-4 mr-1" />
                                        Tải xuống
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between w-full">

                    <div className="flex space-x-3">
                        <Button
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || !hasStatusChanged}
                            className="font-medium min-w-[120px] bg-color: blue"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang lưu...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <HiCheckCircle className="h-4 w-4 mr-1" />
                                    Cập nhật
                                </div>
                            )}
                        </Button>
                        <Button
                            color="gray"
                            onClick={handleClose}
                            disabled={loading}
                            className="font-medium"
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateResume;