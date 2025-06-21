"use client";
import React, { useState, useEffect, FormEvent, useCallback, useRef } from "react";
import { Modal, Button, TextInput, Label, Alert, FileInput } from "flowbite-react";
import api from "@/services/api";
import { UpdateCompanyDTO, UpdateCompanyResponse, Company } from "@/types/company";

// Add Quill type to Window interface
declare global {
  interface Window {
    Quill: any;
  }
}

// Quill.js Rich Text Editor Component
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  disabled = false,
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  // Load Quill.js dynamically
  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && !window.Quill) {
        // Load Quill CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
        document.head.appendChild(link);

        // Load Quill JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
        script.onload = () => {
          setIsQuillLoaded(true);
        };
        document.head.appendChild(script);
      } else if (window.Quill) {
        setIsQuillLoaded(true);
      }
    };

    loadQuill();
  }, []);

  // Initialize Quill editor
  useEffect(() => {
    if (isQuillLoaded && editorRef.current && !quillRef.current) {
      const Quill = (window as any).Quill;

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder,
        readOnly: disabled,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ]
        }
      });

      // Set initial content
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for text changes
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });
    }
  }, [isQuillLoaded, placeholder, disabled, value, onChange]);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  // Update disabled state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  if (!isQuillLoaded) {
    return (
      <div className={`border border-gray-300 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      <div ref={editorRef} style={{ minHeight: '200px' }} />
    </div>
  );
};

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshCompanyTable");

interface UpdateCompanyProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

// Validation rules
const VALIDATION_RULES = {
  name: { required: true, minLength: 2, maxLength: 100 },
  description: { maxLength: 5000 },
  address: { maxLength: 200 }
} as const;

const UpdateCompany: React.FC<UpdateCompanyProps> = ({ company, isOpen, onClose }) => {
  const [formData, setFormData] = useState<UpdateCompanyDTO>({
    id: 0,
    name: "",
    description: "",
    address: "",
    logo: undefined,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  // Pre-fill form with company data
  useEffect(() => {
    if (company) {
      // Ensure logo URL is absolute
      const logoUrl = company.logo?.startsWith('http')
        ? company.logo
        : company.logo
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${company.logo.startsWith('/') ? '' : '/'}${company.logo}`
          : undefined;

      setFormData({
        id: company.id,
        name: company.name || "",
        description: company.description || "",
        address: company.address || "",
        logo: logoUrl,
      });
      setLogoPreview(logoUrl || null);
      setLogoFile(null);
    }
  }, [company]);

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

  // Handle rich text description change
  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));

    // Clear field error
    if (fieldErrors.description) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }

    // Validate description length (strip HTML tags for length check)
    const textContent = value.replace(/<[^>]*>/g, '').trim();
    const fieldError = validateField('description', textContent);
    if (fieldError) {
      setFieldErrors(prev => ({ ...prev, description: fieldError }));
    }
  }, [fieldErrors.description, validateField]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        setError("Logo must be an image (PNG, JPG, JPEG)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Logo file size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    } else {
      setLogoFile(null);
      setLogoPreview(company?.logo || null);
    }
  }, [company?.logo]);

  // Upload file with progress
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "company_logos");

      const response = await api.post<{
        statusCode: number;
        error: string | null;
        message: string;
        data: { fileName: string; uploadedAt: string };
      }>("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        },
      });

      if (!response.data.data.fileName) {
        throw new Error("File upload response missing fileName");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      return `${baseUrl}/storage/company_logos/${encodeURIComponent(response.data.data.fileName)}`;
    } catch (err: any) {
      console.error("File upload error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to upload logo image"
      );
    } finally {
      setUploadProgress(0);
    }
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validate text fields
    ['name', 'address'].forEach(key => {
      const error = validateField(key, formData[key as keyof UpdateCompanyDTO]);
      if (error) {
        errors[key] = error;
      }
    });

    // Validate description (strip HTML for length check)
    if (formData.description) {
      const textContent = formData.description.replace(/<[^>]*>/g, '').trim();
      const descError = validateField('description', textContent);
      if (descError) {
        errors.description = descError;
      }
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

    if (!formData.id) return setError("Company ID is required");

    setLoading(true);
    try {
      let logoUrl: string | undefined = formData.logo;
      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const payload: UpdateCompanyDTO = {
        id: formData.id,
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        logo: logoUrl,
      };

      const response = await api.put<UpdateCompanyResponse>("/companies", payload);
      setSuccess(response.data.message || "Company updated successfully");
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  }, [formData, logoFile, validateForm, uploadFile, onClose]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <Modal show={isOpen} onClose={onClose}  size="5xl" dismissible={!loading}>
      <Modal.Header>Update Company</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Name *" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              color={fieldErrors.name ? "failure" : undefined}
              helperText={fieldErrors.name}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description (Optional)" />
            <RichTextEditor
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Enter detailed company description..."
              disabled={loading}
              className="mt-1"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address" value="Address (Optional)" />
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
              color={fieldErrors.address ? "failure" : undefined}
              helperText={fieldErrors.address}
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="logo" value="Logo (Optional)" />
            <FileInput
              id="logo"
              name="logo"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleFileChange}
              disabled={loading}
              helperText="Max file size: 5MB. Supported formats: PNG, JPG, JPEG"
            />

            {uploadProgress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}

            {logoPreview && (
              <div className="mt-3">
                <Label value="Logo Preview" />
                <div className="flex items-center space-x-3 mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 object-contain border border-gray-200 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/images/logos/companies-icon.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                    disabled={loading}
                    className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
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
          {loading ? (uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : "Updating...") : "Update Company"}
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCompany;