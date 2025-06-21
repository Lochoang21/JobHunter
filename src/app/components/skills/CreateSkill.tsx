"use client";
import React, { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { Modal, Button, TextInput, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { Skill, CreateSkillResponse } from "@/types/skill";

// Props interface
interface CreateSkillProps {
    isOpen: boolean;
    onClose: () => void;
    onSkillCreated?: (skill: Skill) => void;
}

// Validation rules
const VALIDATION_RULES = {
    name: { required: true, minLength: 2, maxLength: 100 },
} as const;

// Initial form state
const INITIAL_FORM_STATE = {
    name: "",
};

const CreateSkill: React.FC<CreateSkillProps> = ({
    isOpen,
    onClose,
    onSkillCreated
}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const firstInputRef = useRef<HTMLInputElement>(null);

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

            if (rules.maxLength && trimmedValue.length > rules.maxLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rules.maxLength} characters`;
            }
        }

        return null;
    }, []);

    // Handle text input changes
    const handleChange = useCallback((
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
            };

            const response = await api.post<CreateSkillResponse>("/skills", payload);
            setSuccess(response.data.message || "Skill created successfully");

            onSkillCreated?.(response.data.data);
            resetForm();

            // Dispatch custom event to refresh table
            const refreshTableEvent = new Event("refreshSkillTable");
            window.dispatchEvent(refreshTableEvent);

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to create skill. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, onSkillCreated, resetForm, onClose]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <Modal
            show={isOpen}
            onClose={handleClose}
            size="md"
            dismissible={!loading}
        >
            <Modal.Header>Create Skill</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name" value="Skill Name *" />
                        <TextInput
                            ref={firstInputRef}
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter skill name (e.g., JavaScript, Python, React)"
                            required
                            color={fieldErrors.name ? "failure" : undefined}
                            helperText={fieldErrors.name}
                            disabled={loading}
                            maxLength={100}
                        />
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
                    {loading ? "Creating..." : "Create Skill"}
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

export default CreateSkill;
