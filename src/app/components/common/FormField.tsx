import React from 'react';
import { Label, TextInput, Select } from 'flowbite-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    register: UseFormRegister<any>;
    errors: FieldErrors;
    options?: { value: string | number; label: string }[];
    isSelect?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    register,
    errors,
    options,
    isSelect = false,
}) => {
    return (
        <div>
            <Label htmlFor={name} value={label} />
            {isSelect ? (
                <Select
                    id={name}
                    {...register(name, { required: required && `${label} is required` })}
                    color={errors[name] ? 'failure' : 'gray'}
                >
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            ) : (
                <TextInput
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    {...register(name, { required: required && `${label} is required` })}
                    color={errors[name] ? 'failure' : 'gray'}
                />
            )}
            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
        </div>
    );
};

export default React.memo(FormField); 