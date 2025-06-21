"use client";
import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { Modal, Button, TextInput, Select, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { GenderEnum, UpdateUserDTO, UpdateUserResponse, User } from "@/types/user";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshUserTable");

interface UpdateUserProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationRule {
  required: boolean;
  minLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
}

// Validation rules
const VALIDATION_RULES: Record<string, ValidationRule> = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /\S+@\S+\.\S+/ },
  address: { required: true, minLength: 5 },
  age: { required: true, min: 1, max: 120 }
} as const;

const UpdateUser: React.FC<UpdateUserProps> = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState<UpdateUserDTO>({
    id: 0,
    email: "",
    name: "",
    address: "",
    gender: GenderEnum.MALE,
    age: 0,
    company: null,
    role: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Pre-fill form with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name || "",
        address: user.address || "",
        gender: user.gender || GenderEnum.MALE,
        age: user.age || 0,
        company: user.company ? { id: user.company.id } : null,
        role: user.role ? { id: user.role.id } : null,
      });
      // Clear any existing field errors when user changes
      setFieldErrors({});
    }
  }, [user]);

  // Validate field
  const validateField = useCallback((name: string, value: any): string | null => {
    const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
    if (!rules) return null;

    if ('required' in rules && rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (name === 'email' && value && rules.pattern && !rules.pattern.test(value)) {
      return 'Please enter a valid email address';
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();

      if ('minLength' in rules && rules.minLength && trimmedValue.length < rules.minLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
      }
    }

    if (name === 'age' && 'min' in rules && 'max' in rules) {
      const numValue = typeof value === 'string' ? parseInt(value) : value;
      if (numValue < rules.min! || numValue > rules.max!) {
        return `Age must be between ${rules.min} and ${rules.max}`;
      }
    }

    return null;
  }, []);

  // Handle form input changes with validation
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const processedValue = name === "age" ? parseInt(value) || 0 : value;

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

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'company' && key !== 'role') {
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
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload: UpdateUserDTO = {
        id: formData.id,
        email: formData.email.trim(),
        name: formData.name.trim(),
        address: formData.address.trim(),
        gender: formData.gender,
        age: formData.age,
        company: formData.company,
        role: formData.role,
      };
      const response = await api.put<UpdateUserResponse>("/users", payload);
      setSuccess(response.data.message);

      // Dispatch custom event to refresh table
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" dismissible={!loading}>
      <Modal.Header>Update User</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Name *" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              color={fieldErrors.name ? "failure" : undefined}
              helperText={fieldErrors.name}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email *" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              color={fieldErrors.email ? "failure" : undefined}
              helperText={fieldErrors.email}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="address" value="Address *" />
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
              color={fieldErrors.address ? "failure" : undefined}
              helperText={fieldErrors.address}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="gender" value="Gender *" />
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value={GenderEnum.MALE}>Male</option>
              <option value={GenderEnum.FEMALE}>Female</option>
              <option value={GenderEnum.OTHER}>Other</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="age" value="Age *" />
            <TextInput
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              value={formData.age === 0 ? "" : formData.age}
              onChange={handleChange}
              placeholder="Enter age (1-120)"
              required
              color={fieldErrors.age ? "failure" : undefined}
              helperText={fieldErrors.age}
              disabled={loading}
            />
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
          {loading ? "Updating..." : "Update User"}
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUser;