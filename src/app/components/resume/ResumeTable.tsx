"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination, Modal, Alert } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Resume, ResumeResponse, ResumeStatusEnum } from "@/types/resume";
import useDebounce from "@/app/hooks/useDebounce";
import UpdateResume from "./UpdateResume";
import ResumeDetailModal from "./ResumeDetailModal";
import { useAuth } from '@/contexts/AuthContext';
import { MODULES, PERMISSION_ACTIONS } from '@/utils/permissions';

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshResumeTable");

interface ResumeTableProps {
    refreshKey?: number;
}

interface SearchState {
    field: string;
    value: string;
}

const ResumeTable: React.FC<ResumeTableProps> = ({ refreshKey = 0 }) => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, pages: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState<SearchState>({ field: "email", value: "" });
    const [searchField, setSearchField] = useState("email");

    // Chỉ debounce search value, không debounce cả object
    const debouncedSearchValue = useDebounce(search.value, 500);

    const [internalRefreshKey, setInternalRefreshKey] = useState(0);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    const { hasRole } = useCurrentUser();
    const { getModulePermissions, hasPermission } = useAuth();
    const perms = getModulePermissions(MODULES.RESUMES);

    // Fetch resumes from API
    const fetchResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            const filter = debouncedSearchValue ? `${search.field}~\ '${debouncedSearchValue}'` : "";
            const response = await api.get<ResumeResponse>("/resumes/all", {
                params: { page: page - 1, size, filter },
            });
            setResumes(response.data.data.result);
            setMeta(response.data.data.meta);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch resumes");
        } finally {
            setLoading(false);
        }
    };

    // Listen for custom refresh event
    useEffect(() => {
        const handleRefresh = () => {
            setInternalRefreshKey((prev) => prev + 1);
        };
        window.addEventListener("refreshResumeTable", handleRefresh);
        return () => {
            window.removeEventListener("refreshResumeTable", handleRefresh);
        };
    }, []);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchResumes();
    }, [page, size, debouncedSearchValue, refreshKey, internalRefreshKey]);

    // Reset page to 1 when search value changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchValue]);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    // Handle status update
    const handleStatusUpdate = async (resumeId: number, newStatus: ResumeStatusEnum) => {
        setUpdateError(null);
        setUpdateSuccess(null);
        setLoading(true);
        try {
            await api.put(`/resumes`, {
                id: resumeId,
                status: newStatus
            });
            setUpdateSuccess(`Resume status updated to ${newStatus}`);
            // Dispatch custom event to refresh table
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setIsDetailModalOpen(false);
                setSelectedResume(null);
            }, 1500);
        } catch (err: any) {
            setUpdateError(err.response?.data?.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    // Handle delete resume
    const handleDelete = async () => {
        if (!selectedResume) return;
        setDeleteError(null);
        setDeleteSuccess(null);
        setLoading(true);
        try {
            await api.delete(`/resumes/${selectedResume.id}`);
            setDeleteSuccess("Resume deleted successfully");
            // Dispatch custom event to refresh table
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setSelectedResume(null);
            }, 1500);
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || "Failed to delete resume");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: ResumeStatusEnum) => {
        const statusConfig = {
            [ResumeStatusEnum.PENDING]: { color: "warning", text: "Pending" },
            [ResumeStatusEnum.REVIEWING]: { color: "purple", text: "Reviewing" },
            [ResumeStatusEnum.APPROVED]: { color: "green", text: "Approved" },
            [ResumeStatusEnum.REJECTED]: { color: "failure", text: "Rejected" },
        };

        const config = statusConfig[status] || { color: "gray", text: "Unknown" };
        return <Badge color={config.color as any}>{config.text}</Badge>;
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

    // Table action items (View, Edit, Delete) với phân quyền mới
    const getTableActions = (resume : Resume) => {
        const actions = [];
        // View action - cần quyền read
        if (perms.canRead) {
            actions.push({
                icon: "solar:eye-linear",
                listtitle: "View",
                onClick: () => {
                    setSelectedResume(resume);
                    setIsDetailModalOpen(true);
                },
            });
        }
        // Edit action - cần quyền update
        if (perms.canUpdate) {
            actions.push({
                icon: "solar:pen-new-square-broken",
                listtitle: "Edit",
                onClick: () => {
                    setSelectedResume(resume);
                    setIsUpdateModalOpen(true);
                },
            });
        }
        // Delete action - cần quyền delete
        if (perms.canDelete) {
            actions.push({
                icon: "solar:trash-bin-minimalistic-outline",
                listtitle: "Delete",
                onClick: () => {
                    setSelectedResume(resume);
                    setIsDeleteModalOpen(true);
                },
            });
        }
        return actions;
    };

    return (
        <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
            <div className="flex justify-between items-center mb-4">
                <h5 className="card-title">Resumes</h5>
                {perms.canCreate && (
                    <Button color="primary" onClick={() => setIsUpdateModalOpen(true)}>
                        Create Resume
                    </Button>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="my-4 flex gap-4 items-center">
                <Select
                    value={searchField}
                    onChange={(e) => {
                        setSearchField(e.target.value);
                        setSearch(prev => ({ ...prev, field: e.target.value }));
                    }}
                    className="w-32"
                >
                    <option value="email">Email</option>
                    <option value="user.name">Applicant</option>
                    <option value="job.name">Job</option>
                    <option value="companyName">Company</option>
                </Select>
                <TextInput
                    type="text"
                    placeholder={`Search by ${search.field}`}
                    value={search.value}
                    onChange={(e) => setSearch(prev => ({ ...prev, value: e.target.value }))}
                    className="w-64"
                />
                {search.value && (
                    <Button
                        color="light"
                        onClick={() => {
                            setSearch(prev => ({ ...prev, value: "" }));
                            setPage(1);
                        }}
                    >
                        Clear
                    </Button>
                )}
            </form>

            {/* Loading and Error States */}
            {loading && (
                <div className="flex justify-center my-4">
                    <Spinner size="lg" />
                </div>
            )}
            {error && (
                <div className="text-red-500 text-center my-4">{error}</div>
            )}

            {/* Table */}
            {!error && (
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell className="p-6">ID</Table.HeadCell>
                            <Table.HeadCell>Applicant</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Job</Table.HeadCell>
                            <Table.HeadCell>Company</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Applied Date</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y divide-border dark:divide-darkborder">
                            {loading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={8} className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <Spinner size="lg" />
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ) : resumes.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={8} className="text-center">
                                        No resumes found
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                resumes.map((resume) => {
                                    const tableActions = getTableActions(resume);
                                    return (
                                        <Table.Row key={resume.id}>
                                            <Table.Cell className="whitespace-nowrap ps-6">
                                                #{resume.id}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div>
                                                    <div className="font-medium text-gray-900">{resume.user.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {resume.user.id}</div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-900">
                                                {resume.email}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div>
                                                    <div className="font-medium text-gray-900">{resume.job.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {resume.job.id}</div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-900">
                                                {resume.companyName || 'N/A'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {getStatusBadge(resume.status)}
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-900">
                                                {formatDate(resume.createAt)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex space-x-2">
                                                    {tableActions.map((action) => (
                                                        <Button
                                                            key={action.listtitle}
                                                            size="xs"
                                                            color="light"
                                                            onClick={action.onClick}
                                                        >
                                                            <Icon icon={action.icon} height={16} />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && resumes.length > 0 && (
                <div className="flex flex-col items-center mt-6">
                    <div className="text-sm text-gray-600 mb-4">
                        Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
                        {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total}{" "}
                        resumes
                    </div>
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.pages}
                        onPageChange={(newPage) => setPage(newPage)}
                        showIcons
                    />
                </div>
            )}

            {/* Detail Modal */}
            <ResumeDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                resume={selectedResume}
                loading={loading}
                updateError={updateError}
                updateSuccess={updateSuccess}
                handleStatusUpdate={handleStatusUpdate}
                formatDate={formatDate}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete resume{" "}
                        <span className="font-semibold">#{selectedResume?.id}</span> from{" "}
                        <span className="font-semibold">{selectedResume?.user.name}</span>?
                    </p>
                    {deleteError && (
                        <Alert color="failure" className="mt-4">
                            <span>{deleteError}</span>
                        </Alert>
                    )}
                    {deleteSuccess && (
                        <Alert color="success" className="mt-4">
                            <span>{deleteSuccess}</span>
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="failure"
                        onClick={handleDelete}
                        disabled={loading}
                        isProcessing={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedResume(null);
                            setDeleteError(null);
                            setDeleteSuccess(null);
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Resume Modal */}
            <UpdateResume
                resume={selectedResume}
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedResume(null);
                }}
            />
        </div>
    );
};

export default ResumeTable;
