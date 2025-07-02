"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination, Modal, Alert } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { Company, CompanyResponse, DeleteCompanyResponse } from "@/types/company";
import CompanyDetail from "@/app/components/companies/CompanyDetail"
import UpdateCompany from "./UpdateCompany";
import CreateCompany from "@/app/components/companies/CreateCompany";
import useDebounce from "@/app/hooks/useDebounce";
import { useAuth } from '@/contexts/AuthContext';
import { MODULES, PERMISSION_ACTIONS } from '@/utils/permissions';

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshCompanyTable");

interface CompanyTableProps {
  refreshKey?: number;
}

interface SearchState {
  field: string;
  value: string;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ refreshKey = 0 }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 5, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState<SearchState>({ field: "name", value: "" });
  const [searchField, setSearchField] = useState("name");
  const debouncedSearch = useDebounce(search, 500);

  const { getModulePermissions, hasPermission } = useAuth();
  const perms = getModulePermissions(MODULES.COMPANIES);
  const [internalRefreshKey, setInternalRefreshKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Fetch companies from API
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = debouncedSearch.value ? `${debouncedSearch.field}~\ '${debouncedSearch.value}'` : "";
      const response = await api.get<CompanyResponse>("/companies", {
        params: { page, size, filter },
      });
      setCompanies(response.data.data.result);
      setMeta(response.data.data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Listen for custom refresh event
  useEffect(() => {
    const handleRefresh = () => {
      setInternalRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("refreshCompanyTable", handleRefresh);
    return () => {
      window.removeEventListener("refreshCompanyTable", handleRefresh);
    };
  }, []);

  // Fetch data when page, size, search, refreshKey, or internalRefreshKey changes
  useEffect(() => {
    fetchCompanies();
  }, [page, size, debouncedSearch.value, refreshKey, internalRefreshKey]);

  // Reset page to 1 when search value changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch.value]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  // Handle delete user
  const handleDelete = async () => {
    if (!selectedCompany) return;
    setDeleteError(null);
    setDeleteSuccess(null);
    setLoading(true);
    try {
      const response = await api.delete<DeleteCompanyResponse>(`/companies/${selectedCompany.id}`);
      setDeleteSuccess(response.data.message || "Company deleted successfully");
      // Dispatch custom event to refresh table
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setSelectedCompany(null);
      }, 1500); // Close modal after success
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Failed to delete company");
    } finally {
      setLoading(false);
    }
  };

  // Table action items (View, Edit, Delete) với phân quyền mới
  const getTableActions = (company: Company) => {
    const actions = [];
    // View action - cần quyền read
    if (perms.canRead) {
      actions.push({
        icon: "solar:eye-linear",
        listtitle: "View",
        onClick: () => {
          setSelectedCompany(company);
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
          setSelectedCompany(company);
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
          setSelectedCompany(company);
          setIsDeleteModalOpen(true);
        },
      });
    }
    return actions;
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">Companies</h5>
        {perms.canCreate && (
          <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
            Create Company
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
          <option value="name">Name</option>
          <option value="address">Address</option>
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
      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="p-6">ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              {/* <Table.HeadCell>Description</Table.HeadCell> */}
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Updated At</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {companies.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={9} className="text-center">
                    No companies found
                  </Table.Cell>
                </Table.Row>
              )}
              {companies.map((company) => {
                const tableActions = getTableActions(company);
                return (
                  <Table.Row key={company.id}>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      {company.id}
                    </Table.Cell>
                    <Table.Cell>{company.name || "N/A"}</Table.Cell>
                    <Table.Cell>{company.address || "N/A"}</Table.Cell>
                    {/* <Table.Cell>
                      {company.description
                        ? company.description.length > 50
                          ? `${company.description.substring(0, 50)}...`
                          : company.description
                        : "N/A"}
                    </Table.Cell> */}
                    <Table.Cell>
                      {company.createAt
                        ? new Date(company.createAt).toLocaleDateString()
                        : "N/A"}
                    </Table.Cell>
                    <Table.Cell>
                      {company.updateAt
                        ? new Date(company.updateAt).toLocaleDateString()
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
              })}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && companies.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
            {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total}{" "}
            companies
          </div>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.pages}
            onPageChange={(newPage) => setPage(newPage)}
            showIcons
          />
        </div>
      )}

      {/* Create Company Modal */}
      <CreateCompany
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Company detail */}
      <CompanyDetail company={selectedCompany}
        isOpen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedCompany(null)
        }} />
      {/* Update Company */}
      <UpdateCompany company={selectedCompany}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedCompany(null)
        }} />

      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Are you sure you want to delete company{" "}
            <span className="font-semibold">{selectedCompany?.name}</span>?
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
              setSelectedCompany(null);
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

export default CompanyTable;