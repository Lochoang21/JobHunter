"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination, Modal, Alert } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { User, ApiResponse, DeleteUserResponse } from "@/types/user";
import UserDetail from "@/app/components/users/UserDetail"
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import useDebounce from "@/app/hooks/useDebounce";
import { useAuth } from '@/contexts/AuthContext';
import { MODULES, PERMISSION_ACTIONS } from '@/utils/permissions';

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshUserTable");

interface UserTableProps {
  refreshKey?: number;
}

interface SearchState {
  field: string;
  value: string;
}

const UserTable: React.FC<UserTableProps> = ({ refreshKey = 0 }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 5, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState<SearchState>({ field: "name", value: "" });
  const [searchField, setSearchField] = useState("name");

  const { getModulePermissions, hasPermission } = useAuth();
  const perms = getModulePermissions(MODULES.USERS);

  // Chỉ debounce search value, không debounce cả object
  const debouncedSearchValue = useDebounce(search.value, 500);

  const [internalRefreshKey, setInternalRefreshKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = debouncedSearchValue ? `${search.field}~\ '${debouncedSearchValue}'` : "";
      const response = await api.get<ApiResponse>("/users", {
        params: { page, size, filter },
      });
      setUsers(response.data.data.result);
      setMeta(response.data.data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Listen for custom refresh event
  useEffect(() => {
    const handleRefresh = () => {
      setInternalRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("refreshUserTable", handleRefresh);
    return () => {
      window.removeEventListener("refreshUserTable", handleRefresh);
    };
  }, []);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchUsers();
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

  // Handle delete user
  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeleteError(null);
    setDeleteSuccess(null);
    setLoading(true);
    try {
      const response = await api.delete<DeleteUserResponse>(`/users/${selectedUser.id}`);
      setDeleteSuccess(response.data.message || "User deleted successfully");
      // Dispatch custom event to refresh table
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }, 1500); // Close modal after success
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Table action items (View, Edit, Delete) với phân quyền mới
  const getTableActions = (user: User) => {
    const actions = [];
    // View action - cần quyền read
    if (perms.canRead) {
      actions.push({
        icon: "solar:eye-linear",
        listtitle: "View",
        onClick: () => {
          setSelectedUser(user);
          setIsDrawerOpen(true);
        },
      });
    }
    // Edit action - cần quyền update
    if (perms.canUpdate) {
      actions.push({
        icon: "solar:pen-new-square-broken",
        listtitle: "Edit",
        onClick: () => {
          setSelectedUser(user);
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
          setSelectedUser(user);
          setIsDeleteModalOpen(true);
        },
      });
    }
    return actions;
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">Users</h5>
        {/* Nút tạo user chỉ hiển thị nếu có quyền create */}
        {perms.canCreate && (
          <CreateUser
            onUserCreated={() => {
              // Refresh table
              setInternalRefreshKey(prev => prev + 1);
            }}
          />
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
          <option value="name">Name</option>
          <option value="email">Email</option>
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
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Updated At</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Spinner size="lg" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No users found
                  </Table.Cell>
                </Table.Row>
              ) : (
                users.map((user) => {
                  const tableActions = getTableActions(user);
                  return (
                    <Table.Row key={user.id}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        {user.id}
                      </Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.name || "N/A"}</Table.Cell>
                      <Table.Cell>
                        {user.createAt
                          ? new Date(user.createAt).toLocaleDateString()
                          : "N/A"}
                      </Table.Cell>
                      <Table.Cell>
                        {user.updateAt
                          ? new Date(user.updateAt).toLocaleDateString()
                          : "N/A"}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex justify-center items-center">
                          {tableActions.length > 0 ? (
                            tableActions.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => item.onClick?.()}
                                className="p-2 rounded-full hover:bg-lightprimary hover:text-primary transition-colors"
                                title={item.listtitle}
                              >
                                <Icon icon={item.icon} height={18} />
                              </button>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No actions available</span>
                          )}
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
      {!loading && !error && users.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
            {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total}{" "}
            users
          </div>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.pages}
            onPageChange={(newPage) => setPage(newPage)}
            showIcons
          />
        </div>
      )}

      {/* User detail */}
      <UserDetail user={selectedUser}
        isOpen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedUser(null)
        }} />
      {/* Update User */}
      <UpdateUser user={selectedUser}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null)
        }} />
      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Are you sure you want to delete user{" "}
            <span className="font-semibold">{selectedUser?.name}</span>?
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
              setSelectedUser(null);
              setDeleteError(null);
              setDeleteSuccess(null);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;