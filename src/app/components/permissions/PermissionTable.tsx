"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination, Modal, Alert } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { Permission, PermissionResponse, DeletePermissionResponse } from "@/types/permission";
import useDebounce from "@/app/hooks/useDebounce";
import CreatePermission from "./CreatePermisson";
import UpdatePermission from "./UpdatePermisson";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshPermissionTable");

interface PermissionTableProps {
    refreshKey?: number;
}

interface SearchState {
    field: string;
    value: string;
}

const PermissionTable: React.FC<PermissionTableProps> = ({ refreshKey = 0 }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 5, pages: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [search, setSearch] = useState<SearchState>({ field: "name", value: "" });
    const [searchField, setSearchField] = useState("name");

    // Chỉ debounce search value, không debounce cả object
    const debouncedSearchValue = useDebounce(search.value, 500);

    const [internalRefreshKey, setInternalRefreshKey] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Fetch permissions from API
    const fetchPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const filter = debouncedSearchValue ? `${search.field}~\ '${debouncedSearchValue}'` : "";
            const response = await api.get<PermissionResponse>("/permissions", {
                params: { page, size, filter },
            });
            setPermissions(response.data.data.result);
            setMeta(response.data.data.meta);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch permissions");
        } finally {
            setLoading(false);
        }
    };

    // Listen for custom refresh event
    useEffect(() => {
        const handleRefresh = () => {
            setInternalRefreshKey((prev) => prev + 1);
        };
        window.addEventListener("refreshPermissionTable", handleRefresh);
        return () => {
            window.removeEventListener("refreshPermissionTable", handleRefresh);
        };
    }, []);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchPermissions();
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

    // Handle delete permission
    const handleDelete = async () => {
        if (!selectedPermission) return;
        setDeleteError(null);
        setDeleteSuccess(null);
        setLoading(true);
        try {
            const response = await api.delete<DeletePermissionResponse>(`/permissions/${selectedPermission.id}`);
            setDeleteSuccess(response.data.message || "Permission deleted successfully");
            // Dispatch custom event to refresh table
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setSelectedPermission(null);
            }, 1500); // Close modal after success
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || "Failed to delete permission");
        } finally {
            setLoading(false);
        }
    };

    // Get method badge color
    const getMethodBadgeColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'indigo';
            case 'POST':
                return 'gray';
            case 'PUT':
                return 'pink';
            case 'DELETE':
                return 'failure';
            default:
                return 'gray';
        }
    };

    // Table action items (Edit, Delete)
    const tableActionData = [
        {
            icon: "solar:pen-new-square-broken", listtitle: "Edit", onClick: (permission: Permission) => {
                setSelectedPermission(permission);
                setIsUpdateModalOpen(true);
            },
        },
        {
            icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete", onClick: (permission: Permission) => {
                setSelectedPermission(permission);
                setIsDeleteModalOpen(true);
            },
        },
    ];

    return (
        <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
            <div className="flex justify-between items-center mb-4">
                <h5 className="card-title">Permissions</h5>
                <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Create Permission
                </Button>
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
                    <option value="name">Name</option>
                    <option value="module">Module</option>
                    <option value="method">Method</option>
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
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>API Path</Table.HeadCell>
                            <Table.HeadCell>Method</Table.HeadCell>
                            <Table.HeadCell>Module</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                            <Table.HeadCell>Updated At</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>
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
                            ) : permissions.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={8} className="text-center">
                                        No permissions found
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                permissions.map((permission) => (
                                    <Table.Row key={permission.id}>
                                        <Table.Cell className="whitespace-nowrap ps-6">
                                            {permission.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-gray-900 dark:text-white">
                                                {permission.name}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {permission.apiPath}
                                            </code>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color={getMethodBadgeColor(permission.method)} className="text-sm">
                                                {permission.method}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="purple" className="text-sm">
                                                {permission.module}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {permission.createAt
                                                ? new Date(permission.createAt).toLocaleDateString()
                                                : "N/A"}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {permission.updateAt
                                                ? new Date(permission.updateAt).toLocaleDateString()
                                                : "N/A"}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-center items-center">
                                                {tableActionData.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => item.onClick?.(permission)}
                                                        className="p-2 rounded-full hover:bg-lightprimary hover:text-primary transition-colors"
                                                        title={item.listtitle}
                                                    >
                                                        <Icon icon={item.icon} height={18} />
                                                    </button>
                                                ))}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && permissions.length > 0 && (
                <div className="flex flex-col items-center mt-6">
                    <div className="text-sm text-gray-600 mb-4">
                        Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
                        {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total}{" "}
                        permissions
                    </div>
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.pages}
                        onPageChange={(newPage) => setPage(newPage)}
                        showIcons
                    />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete permission{" "}
                        <span className="font-semibold">{selectedPermission?.name}</span>?
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
                            setSelectedPermission(null);
                            setDeleteError(null);
                            setDeleteSuccess(null);
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Permission Modal */}
            <UpdatePermission
                permission={selectedPermission}
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedPermission(null);
                }}
            />

            {/* Create Permission Modal */}
            <CreatePermission
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default PermissionTable;
