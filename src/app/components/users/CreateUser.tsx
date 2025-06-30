"use client";
import React, { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { Modal, Button, TextInput, Select, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { GenderEnum, CreateUserDTO, CreateUserResponse } from "@/types/user";
import { Company } from "@/types/company";
import { Role } from "@/types/role";

// Interface cho props nếu cần
interface CreateUserProps {
  onUserCreated?: (user: any) => void; // Callback thay vì custom event
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
  password: { required: true, minLength: 6 },
  address: { required: true, minLength: 5 },
  age: { required: true, min: 1, max: 120 }
} as const;

// Initial form state
const INITIAL_FORM_STATE: CreateUserDTO & { company?: { id: number } | null; role?: { id: number } | null } = {
  name: "",
  email: "",
  password: "",
  address: "",
  gender: GenderEnum.MALE,
  age: 0,
  company: null,
  role: null,
};

const CreateUser: React.FC<CreateUserProps> = ({ onUserCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Ref để focus vào field đầu tiên khi mở modal
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true);
    try {
      const response = await api.get("/companies", {
        params: { page: 1, size: 1000 }, // Get all companies
      });
      setCompanies(response.data.data.result);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const response = await api.get("/roles", {
        params: { page: 1, size: 1000 }, // Get all roles
      });
      setRoles(response.data.data.result);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // Debounced validation
  const validateField = useCallback((name: string, value: any): string | null => {
    const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
    if (!rules) return null;

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (name === 'email' && value && rules.pattern && !rules.pattern.test(value)) {
      return 'Please enter a valid email address';
    }

    if (name === 'password' && value && rules.minLength && value.length < rules.minLength) {
      return `Password must be at least ${rules.minLength} characters`;
    }

    if (name === 'name' && value && rules.minLength && value.trim().length < rules.minLength) {
      return `Name must be at least ${rules.minLength} characters`;
    }

    if (name === 'address' && value && rules.minLength && value.trim().length < rules.minLength) {
      return `Address must be at least ${rules.minLength} characters`;
    }

    if (name === 'age' && rules.min !== undefined && rules.max !== undefined) {
      const numValue = typeof value === 'string' ? parseInt(value) : value;
      if (numValue < rules.min || numValue > rules.max) {
        return `Age must be between ${rules.min} and ${rules.max}`;
      }
    }

    return null;
  }, []);

  // Handle form input changes with real-time validation
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "age") {
      processedValue = parseInt(value) || 0;
    } else if (name === "company") {
      processedValue = value ? { id: parseInt(value) } : null;
    } else if (name === "role") {
      processedValue = value ? { id: parseInt(value) } : null;
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

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'company' && key !== 'role') {
        const error = validateField(key, value);
        if (error) {
          errors[key] = error;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateField]);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFieldErrors({});
    setError(null);
    setSuccess(null);
  }, []);

  // Handle modal open
  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
    // Focus vào input đầu tiên sau khi modal mở
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    if (!loading) {
      setIsOpen(false);
      resetForm();
    }
  }, [loading, resetForm]);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchRoles();
    }
  }, [isOpen, fetchCompanies, fetchRoles]);

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
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        gender: formData.gender,
        age: formData.age,
        company: formData.company,
        role: formData.role,
      };

      const response = await api.post<CreateUserResponse>("/users", payload);
      setSuccess(response.data.message);

      // Callback để parent component xử lý
      onUserCreated?.(response.data);

      resetForm();

      // Đóng modal sau khi thành công
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create user. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onUserCreated, resetForm]);

  return (
    <>
      <Button
        color="primary"
        onClick={handleOpenModal}
        className="mb-4"
      >
        Add New User
      </Button>

      <Modal
        show={isOpen}
        onClose={handleCloseModal}
        size="3xl"
        dismissible={!loading}
      >
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" value="Name *" />
              <TextInput
                ref={firstInputRef}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
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
                placeholder="Enter email address"
                required
                color={fieldErrors.email ? "failure" : undefined}
                helperText={fieldErrors.email}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password *" />
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                required
                color={fieldErrors.password ? "failure" : undefined}
                helperText={fieldErrors.password}
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
                placeholder="Enter full address"
                required
                color={fieldErrors.address ? "failure" : undefined}
                helperText={fieldErrors.address}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formData.age === 0 ? "" : formData.age.toString()}
                  onChange={handleChange}
                  placeholder="Enter age (1-120)"
                  required
                  color={fieldErrors.age ? "failure" : undefined}
                  helperText={fieldErrors.age}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company" value="Company" />
                <Select
                  id="company"
                  name="company"
                  value={formData.company?.id?.toString() || ""}
                  onChange={handleChange}
                  disabled={loading || loadingCompanies}
                >
                  <option value="">Select Company (Optional)</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
                {loadingCompanies && (
                  <div className="text-sm text-gray-500 mt-1">Loading companies...</div>
                )}
              </div>

              <div>
                <Label htmlFor="role" value="Role" />
                <Select
                  id="role"
                  name="role"
                  value={formData.role?.id?.toString() || ""}
                  onChange={handleChange}
                  disabled={loading || loadingRoles}
                >
                  <option value="">Select Role (Optional)</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
                {loadingRoles && (
                  <div className="text-sm text-gray-500 mt-1">Loading roles...</div>
                )}
              </div>
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
            {loading ? "Creating..." : "Create User"}
          </Button>
          <Button
            color="gray"
            onClick={handleCloseModal}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateUser;