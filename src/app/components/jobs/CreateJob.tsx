"use client";
import React, { useState, useEffect, FormEvent, useCallback, useRef } from "react";
import { Modal, Button, TextInput, Textarea, Select, Checkbox, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { JobResponse } from "@/types/job";
import { Skill, SkillResponse } from "@/types/skill";
import { Company, CompanyResponse } from "@/types/company";
import { CreateJobDTO } from "@/types/job";
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

interface CreateJobProps {
    isOpen: boolean;
    onClose: () => void;
}

const refreshTableEvent = new Event("refreshJobTable");


interface FormData extends Omit<CreateJobDTO, 'skills'> {
    skills: { id: number }[];
}

const CreateJob: React.FC<CreateJobProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        location: "",
        salary: 0,
        quantity: 0,
        level: "FRESHER",
        description: "",
        staterDate: "",
        endDate: "",
        active: true,
        skills: [],
        company: { id: 0 },
    });
    const [skills, setSkills] = useState<Skill[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch skills and companies
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get<SkillResponse>("/skills");
                setSkills(response.data.data.result);
                console.log("Skills fetched:", response.data.data.result);
            } catch (err: any) {
                console.error("Fetch skills error:", err.response?.data || err.message);
            }
        };
        const fetchCompanies = async () => {
            try {
                const response = await api.get<CompanyResponse>("/companies");
                setCompanies(response.data.data.result);
                console.log("Companies fetched:", response.data.data.result);
            } catch (err: any) {
                console.error("Fetch companies error:", err.response?.data || err.message);
            }
        };
        if (isOpen) {
            fetchSkills();
            fetchCompanies();
        }
    }, [isOpen]);

    // Handle text input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));
    };

    // Handle company selection
    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = parseInt(e.target.value);
        setFormData((prev) => ({
            ...prev,
            company: { id: companyId || 0 },
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            active: e.target.checked,
        }));
    };

    // Handle skills multi-select
    const handleSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
            parseInt(option.value)
        );
        setFormData((prev) => ({
            ...prev,
            skills: selectedOptions.map(id => ({ id })),
        }));
    };

    // Handle rich text description change
    const handleDescriptionChange = useCallback((value: string) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
    }, []);

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate required fields
        if (!formData.name) return setError("Name is required");
        if (formData.salary <= 0) return setError("Salary must be greater than 0");
        if (formData.quantity <= 0) return setError("Quantity must be greater than 0");
        if (!formData.level) return setError("Level is required");
        if (!formData.company.id) return setError("Company is required");

        setLoading(true);
        try {
            const payload: CreateJobDTO = {
                name: formData.name,
                location: formData.location || undefined,
                salary: formData.salary,
                quantity: formData.quantity,
                level: formData.level,
                description: formData.description || undefined,
                staterDate: formData.staterDate ? new Date(formData.staterDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                active: formData.active,
                skills: formData.skills?.map(skill => ({ id: skill.id })) || undefined,
                company: formData.company
            };

            const response = await api.post<JobResponse>("/jobs", payload);
            setSuccess(response.data.message || "Job created successfully");
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setFormData({
                    name: "",
                    location: "",
                    salary: 0,
                    quantity: 0,
                    level: "FRESHER",
                    description: "",
                    staterDate: "",
                    endDate: "",
                    active: true,
                    skills: [],
                    company: { id: 0 },
                });
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create job");
            console.error("Create job error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="5xl">
            <Modal.Header>Create Job</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter job name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="location" value="Location (optional)" />
                            <TextInput
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter job location"
                            />
                        </div>
                        <div>
                            <Label htmlFor="salary" value="Salary" />
                            <TextInput
                                id="salary"
                                name="salary"
                                type="number"
                                value={formData.salary || ""}
                                onChange={handleChange}
                                placeholder="Enter salary"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="quantity" value="Quantity" />
                            <TextInput
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity || ""}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="level" value="Level" />
                            <Select
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                            >
                                <option value="INTERNSHIP">Internship</option>
                                <option value="FRESHER">Fresher</option>
                                <option value="JUNIOR">Junior</option>
                                <option value="MIDDLE">Middle</option>
                                <option value="SENIOR">Senior</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="companyId" value="Company" />
                            <Select
                                id="companyId"
                                name="companyId"
                                value={formData.company.id || ""}
                                onChange={handleCompanyChange}
                                required
                            >
                                <option value="">Select a company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="staterDate" value="Start Date (optional)" />
                            <TextInput
                                id="staterDate"
                                name="staterDate"
                                type="datetime-local"
                                value={formData.staterDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate" value="End Date (optional)" />
                            <TextInput
                                id="endDate"
                                name="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" value="Description (optional)" />
                        <RichTextEditor
                            value={formData.description || ''}
                            onChange={handleDescriptionChange}
                            placeholder="Enter detailed job description..."
                            disabled={loading}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleCheckboxChange}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                        <div>
                            <Label htmlFor="skills" value="Skills (optional)" />
                            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`skill-${skill.id}`}
                                            checked={formData.skills.some(s => s.id === skill.id)}
                                            onChange={(e) => {
                                                const newSkills = e.target.checked
                                                    ? [...formData.skills, { id: skill.id }]
                                                    : formData.skills.filter(s => s.id !== skill.id);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    skills: newSkills
                                                }));
                                            }}
                                        />
                                        <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
                                    </div>
                                ))}
                            </div>
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
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    isProcessing={loading}
                >
                    Create Job
                </Button>
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateJob;