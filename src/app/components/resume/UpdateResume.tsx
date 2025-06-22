"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Alert } from "flowbite-react";
import api from "@/services/api";
import { Resume, ResumeStatusEnum } from "@/types/resume";

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

            setSuccess("Resume status updated successfully");

            // Dispatch custom event to refresh table
            const refreshTableEvent = new Event("refreshResumeTable");
            window.dispatchEvent(refreshTableEvent);

            // Close modal after success
            setTimeout(() => {
                onClose();
                setSuccess(null);
            }, 1500);

        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update resume status");
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

    const getStatusColor = (status: ResumeStatusEnum) => {
        const statusConfig = {
            [ResumeStatusEnum.PENDING]: "warning",
            [ResumeStatusEnum.REVIEWING]: "warning",
            [ResumeStatusEnum.APPROVED]: "success",
            [ResumeStatusEnum.REJECTED]: "failure",
        };
        return statusConfig[status] || "gray";
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

    return (
        <Modal show={isOpen} onClose={handleClose} size="lg">
            <Modal.Header>
                Update Resume Status - #{resume?.id}
            </Modal.Header>
            <Modal.Body>
                {resume && (
                    <div className="space-y-6">
                        {error && (
                            <Alert color="failure">
                                <span>{error}</span>
                            </Alert>
                        )}
                        {success && (
                            <Alert color="success">
                                <span>{success}</span>
                            </Alert>
                        )}

                        {/* Resume Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Applicant Information</h4>
                                <p><strong>Name:</strong> {resume.user.name}</p>
                                <p><strong>Email:</strong> {resume.email}</p>
                                <p><strong>User ID:</strong> {resume.user.id}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Job Information</h4>
                                <p><strong>Job:</strong> {resume.job.name}</p>
                                <p><strong>Company:</strong> {resume.companyName}</p>
                                <p><strong>Job ID:</strong> {resume.job.id}</p>
                            </div>
                        </div>

                        {/* Current Status */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(resume.status)}-100 text-${getStatusColor(resume.status)}-800`}>
                                    {resume.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Applied: {formatDate(resume.createAt)}
                                </span>
                            </div>
                        </div>

                        {/* Status Update Form */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Update Status</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Status
                                    </label>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as ResumeStatusEnum)}
                                        disabled={loading}
                                    >
                                        <option value={ResumeStatusEnum.PENDING}>Pending</option>
                                        <option value={ResumeStatusEnum.REVIEWING}>Reviewing</option>
                                        <option value={ResumeStatusEnum.APPROVED}>Approved</option>
                                        <option value={ResumeStatusEnum.REJECTED}>Rejected</option>
                                    </Select>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p><strong>Status Descriptions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 mt-1">
                                        <li><strong>Pending:</strong> Resume submitted, waiting for review</li>
                                        <li><strong>Reviewing:</strong> Resume is being reviewed by HR</li>
                                        <li><strong>Approved:</strong> Resume approved, candidate will be contacted</li>
                                        <li><strong>Rejected:</strong> Resume not suitable for the position</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Resume File Link */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Resume File</h4>
                            <p><strong>File:</strong> {resume.url}</p>
                            <a
                                href={`http://localhost:8080/storage/resumes/${resume.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                                Download Resume
                            </a>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="flex space-x-2">
                    <Button
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading || status === resume?.status}
                        isProcessing={loading}
                    >
                        {loading ? "Updating..." : "Update Status"}
                    </Button>
                    <Button
                        color="gray"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateResume;
