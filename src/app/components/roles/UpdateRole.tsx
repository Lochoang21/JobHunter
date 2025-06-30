"use client";
import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { Modal, Button, TextInput, Textarea, Label, Alert, Tabs, Card, Checkbox, Badge } from "flowbite-react";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { Role, UpdateRoleDTO } from "@/types/role";
import { Permission } from "@/types/permission";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshRoleTable");

interface UpdateRoleProps {
    role: Role | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ValidationRule {
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

// Validation rules
const VALIDATION_RULES: Record<string, ValidationRule> = {
    name: { required: true, minLength: 2, maxLength: 50 },
    description: { required: false, maxLength: 500 }
} as const;

const UpdateRole: React.FC<UpdateRoleProps> = ({ role, isOpen, onClose }) => {
    const [formData, setFormData] = useState<UpdateRoleDTO>({
        id: 0,
        name: "",
        description: "",
        active: true,
        permissions: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());

    // Fetch permissions
    const fetchPermissions = useCallback(async () => {
        setLoadingPermissions(true);
        try {
            const response = await api.get("/permissions", {
                params: { page: 1, size: 1000 }, // Get all permissions
            });
            setPermissions(response.data.data.result);
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
        } finally {
            setLoadingPermissions(false);
        }
    }, []);

    // Pre-fill form with role data when role changes
    useEffect(() => {
        if (role) {
            setFormData({
                id: role.id,
                name: role.name || "",
                description: role.description || "",
                active: role.active ?? true,
                permissions: role.permissions || []
            });

            // Set selected permissions
            const selectedIds = new Set(role.permissions?.map(p => p.id) || []);
            setSelectedPermissions(selectedIds);

            // Clear any existing field errors when role changes
            setFieldErrors({});
        }
    }, [role]);

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen, fetchPermissions]);

    // Validate field
    const validateField = useCallback((name: string, value: any): string | null => {
        const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
        if (!rules) return null;

        if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        if (typeof value === 'string') {
            const trimmedValue = value.trim();

            if (rules.minLength && trimmedValue.length < rules.minLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
            }

            if (rules.maxLength && trimmedValue.length > rules.maxLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at most ${rules.maxLength} characters`;
            }
        }

        return null;
    }, []);

    // Handle form input changes with validation
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            processedValue = checkbox.checked;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));

        // Clear previous errors for this field
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Real-time validation
        const fieldError = validateField(name, processedValue);
        if (fieldError) {
            setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
        }
    }, [fieldErrors, validateField]);

    // Handle permission selection
    const handlePermissionToggle = useCallback((permissionId: number) => {
        setSelectedPermissions((prev: Set<number>) => {
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                newSet.delete(permissionId);
            } else {
                newSet.add(permissionId);
            }
            return newSet;
        });
    }, []);

    // Validate entire form
    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'permissions') {
                const error = validateField(key, value);
                if (error) {
                    errors[key] = error;
                }
            }
        });

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, validateField]);

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submitted", { formData, selectedPermissions });
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            console.log("Form validation failed", fieldErrors);
            return;
        }

        setLoading(true);
        try {
            // Convert selected permissions to the format expected by API
            const selectedPermissionObjects = Array.from(selectedPermissions).map(id => ({ id }));

            const payload: UpdateRoleDTO = {
                id: formData.id,
                name: formData.name.trim(),
                description: formData.description.trim(),
                active: formData.active,
                permissions: selectedPermissionObjects
            };

            console.log("Sending payload to API:", payload);
            const response = await api.put("/roles", payload);
            console.log("API response:", response.data);
            setSuccess(response.data.message || "Role updated successfully");

            // Dispatch custom event to refresh table
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => onClose(), 1500); // Close modal after success
        } catch (err: any) {
            console.error("API error:", err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to update role. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || 'Other';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <Modal show={isOpen} onClose={onClose} size="4xl" dismissible={!loading}>
            <Modal.Header>
                <div className="flex items-center space-x-2">
                    <Icon icon="heroicons:pencil-square" className="w-6 h-6 text-blue-600" />
                    <span>Update Role</span>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" value="Role Name *" />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter role name"
                                required
                                color={fieldErrors.name ? "failure" : undefined}
                                helperText={fieldErrors.name}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter role description"
                                rows={3}
                                color={fieldErrors.description ? "failure" : undefined}
                                helperText={fieldErrors.description}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <Label htmlFor="active" value="Active" />
                        </div>
                    </div>

                    {/* Permissions Assignment */}
                    <div>
                        <Label value="Permissions Assignment" className="text-lg font-semibold mb-4 block" />
                        {loadingPermissions ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Loading permissions...</span>
                            </div>
                        ) : (
                            <Tabs>
                                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                                    <Tabs.Item key={module} title={module}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {modulePermissions.map((permission) => (
                                                <Card key={permission.id} className="hover:shadow-md transition-shadow">
                                                    <div className="flex items-start space-x-3">
                                                        <Checkbox
                                                            id={`permission-${permission.id}`}
                                                            checked={selectedPermissions.has(permission.id)}
                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                            disabled={loading}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {permission.name}
                                                                </span>
                                                                <Badge color="gray" size="sm">
                                                                    {permission.method}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {permission.apiPath}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </Tabs.Item>
                                ))}
                            </Tabs>
                        )}
                    </div>

                    {error && (
                        <Alert color="failure" className="mt-4">
                            <span>{error}</span>
                        </Alert>
                    )}

                    {success && (
                        <Alert color="success" className="mt-4">
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
                    {loading ? "Updating..." : "Update Role"}
                </Button>
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateRole;
