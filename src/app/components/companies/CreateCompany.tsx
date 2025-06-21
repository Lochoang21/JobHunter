"use client";
import React, { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { Modal, Button, TextInput, Label, Alert, FileInput } from "flowbite-react";
import api from "@/services/api";
import { CreateCompanyDTO, CreateCompanyResponse } from "@/types/company";

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

// Props interface
interface CreateCompanyProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated?: (company: any) => void;
}

// Validation rules
const VALIDATION_RULES = {
  name: { required: true, minLength: 2, maxLength: 100 },
  description: { maxLength: 5000 },
  address: { maxLength: 200 }
} as const;

// Initial form state
const INITIAL_FORM_STATE: CreateCompanyDTO = {
  name: "",
  description: "",
  address: "",
  logo: undefined,
};

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CreateCompany: React.FC<CreateCompanyProps> = ({
  isOpen,
  onClose,
  onCompanyCreated
}) => {
  const [formData, setFormData] = useState<CreateCompanyDTO>(INITIAL_FORM_STATE);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Logo must be an image (PNG, JPG, JPEG, WebP)");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("Logo file size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  }, []);

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

      // Ensure the URL starts with http:// or https://
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
      const error = validateField(key, formData[key as keyof CreateCompanyDTO]);
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

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setLogoFile(null);
    setLogoPreview(null);
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
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
      let logoUrl: string | undefined = undefined;
      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const payload: CreateCompanyDTO = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        logo: logoUrl,
      };

      const response = await api.post<CreateCompanyResponse>("/companies", payload);
      setSuccess(response.data.message || "Company created successfully");

      onCompanyCreated?.(response.data);
      resetForm();

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create company. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, logoFile, validateForm, uploadFile, onCompanyCreated, resetForm, onClose]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <Modal
      show={isOpen}
      onClose={handleClose}
       size="5xl"
      dismissible={!loading}
    >
      <Modal.Header>Create Company</Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" value="Company Name *" />
            <TextInput
              ref={firstInputRef}
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
            <Label htmlFor="logo" value="Company Logo (Optional)" />
            <FileInput
              id="logo"
              name="logo"
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
              disabled={loading}
              helperText="Max file size: 5MB. Supported formats: PNG, JPG, JPEG, WebP"
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
                      // Fallback to a default image if the logo fails to load
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
          {loading ? (uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : "Creating...") : "Create Company"}
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

export default CreateCompany;