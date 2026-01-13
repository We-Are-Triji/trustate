"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#CBD5E1] focus:ring-[#CBD5E1] ${
            error ? "border-red-400" : ""
          }`}
        />
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
