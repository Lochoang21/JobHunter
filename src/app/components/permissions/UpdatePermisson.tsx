"use client";
import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { Modal, Button, TextInput, Label, Alert, Select } from "flowbite-react";
import api from "@/services/api";
import { Permission, UpdatePermissionResponse } from "@/types/permission";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshPermissionTable");

interface UpdatePermissionProps {
    permission: Permission | null;
    isOpen: boolean;
    onClose: () => void;
}

// Validation rules
const VALIDATION_RULES = {
    name: { required: true, minLength: 2, maxLength: 100 },
    apiPath: { required: true, minLength: 1, maxLength: 200 },
    method: { required: true },
    module: { required: true },
} as const;

// HTTP Methods
const HTTP_METHODS = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "DELETE", label: "DELETE" },
    { value: "PATCH", label: "PATCH" },
];

// Modules
const MODULES = [
    { value: "AUTHS", label: "AUTHS" },
    { value: "COMPANIES", label: "COMPANIES" },
    { value: "FILES", label: "FILES" },
    { value: "JOBS", label: "JOBS" },
    { value: "PERMISSIONS", label: "PERMISSIONS" },
    { value: "RESUMES", label: "RESUMES" },
    { value: "ROLES", label: "ROLES" },
    { value: "USERS", label: "USERS" },
];

const UpdatePermission: React.FC<UpdatePermissionProps> = ({ permission, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        apiPath: "",
        method: "",
        module: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

    // Pre-fill form with permission data
    useEffect(() => {
        if (permission) {
            setFormData({
                id: permission.id,
                name: permission.name || "",
                apiPath: permission.apiPath || "",
                method: permission.method || "",
                module: permission.module || "",
            });
        }
    }, [permission]);

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

    // Handle select changes
    const handleSelectChange = useCallback((
        e: React.ChangeEvent<HTMLSelectElement>
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

    // Validate entire form
    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        // Validate all fields
        Object.keys(VALIDATION_RULES).forEach(fieldName => {
            const fieldError = validateField(fieldName, formData[fieldName as keyof typeof formData]);
            if (fieldError) {
                errors[fieldName] = fieldError;
            }
        });

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, validateField]);

    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        if (!formData.id) return setError("Permission ID is required");

        setLoading(true);
        try {
            const payload = {
                id: formData.id,
                name: formData.name.trim(),
                apiPath: formData.apiPath.trim(),
                method: formData.method,
                module: formData.module,
            };

            const response = await api.put<UpdatePermissionResponse>("/permissions", payload);
            setSuccess(response.data.message || "Permission updated successfully");
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to update permission. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, onClose]);

    return (
        <Modal show={isOpen} onClose={onClose} size="md" dismissible={!loading}>
            <Modal.Header>Update Permission</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name" value="Permission Name *" />
                        <TextInput
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleTextChange}
                            placeholder="Enter permission name (e.g., Create a user, Update company)"
                            required
                            color={fieldErrors.name ? "failure" : undefined}
                            helperText={fieldErrors.name}
                            disabled={loading}
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <Label htmlFor="apiPath" value="API Path *" />
                        <TextInput
                            id="apiPath"
                            name="apiPath"
                            value={formData.apiPath}
                            onChange={handleTextChange}
                            placeholder="Enter API path (e.g., /api/v1/users, /companies)"
                            required
                            color={fieldErrors.apiPath ? "failure" : undefined}
                            helperText={fieldErrors.apiPath}
                            disabled={loading}
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <Label htmlFor="method" value="HTTP Method *" />
                        <Select
                            id="method"
                            name="method"
                            value={formData.method}
                            onChange={handleSelectChange}
                            required
                            color={fieldErrors.method ? "failure" : undefined}
                            helperText={fieldErrors.method}
                            disabled={loading}
                        >
                            <option value="">Select HTTP Method</option>
                            {HTTP_METHODS.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="module" value="Module *" />
                        <Select
                            id="module"
                            name="module"
                            value={formData.module}
                            onChange={handleSelectChange}
                            required
                            color={fieldErrors.module ? "failure" : undefined}
                            helperText={fieldErrors.module}
                            disabled={loading}
                        >
                            <option value="">Select Module</option>
                            {MODULES.map((module) => (
                                <option key={module.value} value={module.value}>
                                    {module.label}
                                </option>
                            ))}
                        </Select>
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
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    isProcessing={loading}
                >
                    {loading ? "Updating..." : "Update Permission"}
                </Button>
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdatePermission;
