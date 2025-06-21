"use client";
import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { Modal, Button, TextInput, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { Skill, UpdateSkillResponse } from "@/types/skill";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshSkillTable");

interface UpdateSkillProps {
    skill: Skill | null;
    isOpen: boolean;
    onClose: () => void;
}

// Validation rules
const VALIDATION_RULES = {
    name: { required: true, minLength: 2, maxLength: 100 },
} as const;

const UpdateSkill: React.FC<UpdateSkillProps> = ({ skill, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
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

            if (rules.maxLength && trimmedValue.length > rules.maxLength) {
                return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rules.maxLength} characters`;
            }
        }

        return null;
    }, []);

    // Pre-fill form with skill data
    useEffect(() => {
        if (skill) {
            setFormData({
                id: skill.id,
                name: skill.name || "",
            });
        }
    }, [skill]);

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

    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        if (!formData.id) return setError("Skill ID is required");

        setLoading(true);
        try {
            const payload = {
                id: formData.id,
                name: formData.name.trim(),
            };

            const response = await api.put<UpdateSkillResponse>("/skills", payload);
            setSuccess(response.data.message || "Skill updated successfully");
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update skill");
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, onClose]);

    return (
        <Modal show={isOpen} onClose={onClose} size="md" dismissible={!loading}>
            <Modal.Header>Update Skill</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name" value="Skill Name *" />
                        <TextInput
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
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    isProcessing={loading}
                >
                    {loading ? "Updating..." : "Update Skill"}
                </Button>
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateSkill;
