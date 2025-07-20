"use client";
import React, { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { Modal, Button, TextInput, Label, Alert, Select, Checkbox, Badge, Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { Role, CreateRoleResponse } from "@/types/role";
import { Permission, PermissionResponse } from "@/types/permission";

// Props interface
interface CreateRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onRoleCreated?: (role: Role) => void;
}

// Validation rules
const VALIDATION_RULES = {
    name: { required: true, minLength: 2, maxLength: 50 },
    description: { required: false, maxLength: 200 },
} as const;

// Initial form state
const INITIAL_FORM_STATE = {
    name: "",
    description: "",
    active: true,
    permissions: [] as number[],
};

const CreateRole: React.FC<CreateRoleProps> = ({
    isOpen,
    onClose,
    onRoleCreated
}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

    const firstInputRef = useRef<HTMLInputElement>(null);

    // Fetch all permissions for selection
    const fetchPermissions = useCallback(async () => {
        setLoadingPermissions(true);
        try {
            const response = await api.get<PermissionResponse>("/permissions", {
                params: { page: 1, size: 1000 }, // Get all permissions
            });
            setPermissions(response.data.data.result);
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
        } finally {
            setLoadingPermissions(false);
        }
    }, []);

    // Validate field
    const validateField = useCallback((name: string, value: any): string | null => {
        const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
        if (!rules) return null;

        if ('required' in rules && rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        if (typeof value === 'string') {
            const trimmedValue = value.trim();

            if ('minLength' in rules && rules.minLength && trimmedValue.length < rules.minLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
            }

            if ('maxLength' in rules && rules.maxLength && trimmedValue.length > rules.maxLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rules.maxLength} characters`;
            }
        }

        return null;
    }, []);

    // Handle text input changes
    const handleTextChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Real-time validation
        const fieldError = validateField(name, value);
        if (fieldError) {
            setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
        }
    }, [fieldErrors, validateField]);

    // Handle checkbox changes
    const handleCheckboxChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }, []);

    // Handle permission selection
    const handlePermissionToggle = useCallback((permission: Permission) => {
        setSelectedPermissions(prev => {
            const isSelected = prev.some(p => p.id === permission.id);
            if (isSelected) {
                return prev.filter(p => p.id !== permission.id);
            } else {
                return [...prev, permission];
            }
        });
    }, []);

    // Validate entire form
    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        // Validate name field
        const nameError = validateField('name', formData.name);
        if (nameError) {
            errors.name = nameError;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, validateField]);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setFieldErrors({});
        setError(null);
        setSuccess(null);
        setSelectedPermissions([]);
    }, []);

    // Handle modal close
    const handleClose = useCallback(() => {
        if (!loading) {
            onClose();
            resetForm();
        }
    }, [loading, onClose, resetForm]);

    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                active: formData.active,
                permissions: selectedPermissions.map(p => ({ id: p.id })),
            };

            const response = await api.post<CreateRoleResponse>("/roles", payload);
            setSuccess(response.data.message || "Role created successfully");

            onRoleCreated?.(response.data.data);
            resetForm();

            // Dispatch custom event to refresh table
            const refreshTableEvent = new Event("refreshRoleTable");
            window.dispatchEvent(refreshTableEvent);

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to create role. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [formData, selectedPermissions, validateForm, onRoleCreated, resetForm, onClose]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Fetch permissions when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen, fetchPermissions]);

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc, permission) => {
        const moduleName = permission.module;
        if (!acc[moduleName]) {
            acc[moduleName] = [];
        }
        acc[moduleName].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

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

    return (
        <Modal
            show={isOpen}
            onClose={handleClose}
            size="4xl"
            dismissible={!loading}
        >
            <Modal.Header>Create New Role</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" value="Role Name *" />
                            <TextInput
                                ref={firstInputRef}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleTextChange}
                                placeholder="Enter role name (e.g., MANAGER, EDITOR)"
                                required
                                color={fieldErrors.name ? "failure" : undefined}
                                helperText={fieldErrors.name}
                                disabled={loading}
                                maxLength={50}
                            />
                        </div>
                        <div>
                            <Label htmlFor="active" value="Status" />
                            <div className="flex items-center mt-2">
                                <Checkbox
                                    id="active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleCheckboxChange}
                                    disabled={loading}
                                />
                                <Label htmlFor="active" className="ml-2">
                                    Active
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" value="Description" />
                        <TextInput
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleTextChange}
                            placeholder="Enter role description"
                            color={fieldErrors.description ? "failure" : undefined}
                            helperText={fieldErrors.description}
                            disabled={loading}
                            maxLength={200}
                        />
                    </div>

                    {/* Permissions Selection */}
                    <div>
                        <Label value="Permissions" />
                        <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            {loadingPermissions ? (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        <span className="ml-2">Loading permissions...</span>
                                    </div>
                                </div>
                            ) : (
                                <Tabs>
                                    {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                                        <Tabs.Item key={module} title={module}>
                                            <div className="max-h-64 overflow-y-auto">
                                                <div className="grid grid-cols-1 gap-2">
                                                    {modulePermissions.map((permission) => {
                                                        const isSelected = selectedPermissions.some(p => p.id === permission.id);
                                                        return (
                                                            <div
                                                                key={permission.id}
                                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${isSelected
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                                onClick={() => handlePermissionToggle(permission)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <Checkbox
                                                                            checked={isSelected}
                                                                            readOnly
                                                                            className="mr-3"
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium text-gray-900">
                                                                                {permission.name}
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {permission.apiPath}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <Badge color={getMethodBadgeColor(permission.method)} className="text-xs">
                                                                        {permission.method}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </Tabs.Item>
                                    ))}
                                </Tabs>
                            )}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Selected: {selectedPermissions.length} permission(s)
                        </div>
                    </div>

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
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    isProcessing={loading}
                >
                    {loading ? "Creating..." : "Create Role"}
                </Button>
                <Button
                    color="gray"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateRole;
