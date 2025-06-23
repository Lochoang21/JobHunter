import React from "react";
import { Modal, Button, Alert, Badge } from "flowbite-react";
import { Resume, ResumeStatusEnum } from "@/types/resume";
import {
    HiUser,
    HiMail,
    HiOfficeBuilding,
    HiBriefcase,
    HiCalendar,
    HiDownload,
    HiDocumentText,
    HiClock
} from "react-icons/hi";

interface ResumeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    resume: Resume | null;
    loading: boolean;
    updateError: string | null;
    updateSuccess: string | null;
    handleStatusUpdate: (resumeId: number, newStatus: ResumeStatusEnum) => void;
    formatDate: (dateString: string) => string;
}

const ResumeDetailModal: React.FC<ResumeDetailModalProps> = ({
    isOpen,
    onClose,
    resume,
    loading,
    updateError,
    updateSuccess,
    handleStatusUpdate,
    formatDate
}) => {
    const getStatusBadge = (status: ResumeStatusEnum) => {
        switch (status) {
            case ResumeStatusEnum.PENDING:
                return <Badge color="warning" size="sm">Đang chờ duyệt</Badge>;
            case ResumeStatusEnum.APPROVED:
                return <Badge color="success" size="sm">Đã duyệt</Badge>;
            case ResumeStatusEnum.REJECTED:
                return <Badge color="failure" size="sm">Đã từ chối</Badge>;
            default:
                return <Badge color="gray" size="sm">{status}</Badge>;
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="2xl">
            <Modal.Header className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between w-full">
                    {/* Bên trái */}
                    <div className="flex items-center space-x-3">
                        <HiDocumentText className="h-6 w-6 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Chi tiết hồ sơ ứng tuyển
                            </h3>
                            <p className="text-sm text-gray-500">ID: #{resume?.id}</p>
                        </div>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="p-0">
                {resume && (
                    <div className="max-h-96 overflow-y-auto">
                        {/* Alert Messages */}
                        {(updateError || updateSuccess) && (
                            <div className="p-6 border-b border-gray-100">
                                {updateError && (
                                    <Alert color="failure" className="mb-3">
                                        <span>{updateError}</span>
                                    </Alert>
                                )}
                                {updateSuccess && (
                                    <Alert color="success">
                                        <span>{updateSuccess}</span>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="p-6 space-y-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <h4 className="text-md font-semibold text-gray-900 mr-5">
                                        Trạng thái hồ sơ:
                                    </h4>
                                    {resume && getStatusBadge(resume.status)}
                                </div>
                            </div>
                            {/* Applicant Information */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <HiUser className="h-5 w-5 text-blue-600 mr-2" />
                                    <h4 className="text-md font-semibold text-gray-900">
                                        Thông tin ứng viên
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-20">Họ tên:</span>
                                        <span className="text-gray-900">{resume.user.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <HiMail className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-gray-900">{resume.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-20">User ID:</span>
                                        <span className="text-gray-600">#{resume.user.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Information */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <HiBriefcase className="h-5 w-5 text-green-600 mr-2" />
                                    <h4 className="text-md font-semibold text-gray-900">
                                        Thông tin công việc
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Vị trí:</span>
                                        <span className="text-gray-900 font-medium">{resume.job.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <HiOfficeBuilding className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-gray-900">{resume.companyName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Job ID:</span>
                                        <span className="text-gray-600">#{resume.job.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resume File */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <HiDocumentText className="h-5 w-5 text-purple-600 mr-2" />
                                    <h4 className="text-md font-semibold text-gray-900">
                                        Hồ sơ đính kèm
                                    </h4>
                                </div>
                                <div className="flex items-center justify-between bg-white rounded border p-3">
                                    <div className="flex items-center">
                                        <HiDocumentText className="h-8 w-8 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {resume.url}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tệp đính kèm CV
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:8080/storage/resumes/${resume.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors duration-200"
                                    >
                                        <HiDownload className="h-4 w-4 mr-1" />
                                        Tải xuống
                                    </a>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <HiClock className="h-5 w-5 text-gray-600 mr-2" />
                                    <h4 className="text-md font-semibold text-gray-900">
                                        Lịch sử thao tác
                                    </h4>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <HiCalendar className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700">Ngày ứng tuyển:</span>
                                        </div>
                                        <span className="text-gray-900">{formatDate(resume.createAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <HiCalendar className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700">Cập nhật cuối:</span>
                                        </div>
                                        <span className="text-gray-900">{formatDate(resume.updateAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-700">Tạo bởi:</span>
                                        <span className="text-gray-900">{resume.createBy}</span>
                                    </div>
                                    {resume.updateBy && (
                                        <div className="flex items-center justify-between py-2">
                                            <span className="font-medium text-gray-700">Cập nhật bởi:</span>
                                            <span className="text-gray-900">{resume.updateBy}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between w-full">
                    <div className="flex space-x-2">
                        {resume?.status === ResumeStatusEnum.PENDING && (
                            <>
                                <Button
                                    color="success"
                                    size="sm"
                                    onClick={() => resume && handleStatusUpdate(resume.id, ResumeStatusEnum.APPROVED)}
                                    disabled={loading}
                                    className="font-medium"
                                >
                                    ✓ Chấp nhận
                                </Button>
                                <Button
                                    color="failure"
                                    size="sm"
                                    onClick={() => resume && handleStatusUpdate(resume.id, ResumeStatusEnum.REJECTED)}
                                    disabled={loading}
                                    className="font-medium"
                                >
                                    ✗ Từ chối
                                </Button>
                            </>
                        )}
                    </div>
                    <Button
                        color="gray"
                        onClick={onClose}
                        className="font-medium"
                    >
                        Đóng
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ResumeDetailModal;