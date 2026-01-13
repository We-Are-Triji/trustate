"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "./form-field";
import { PasswordMeter } from "./password-meter";
import { validators } from "@/lib/validation";
import type { BasicInfoData } from "@/lib/types/registration";

interface BasicInfoFormProps {
  onSubmit: (data: BasicInfoData) => void;
}

export function BasicInfoForm({ onSubmit }: BasicInfoFormProps) {
  const [form, setForm] = useState<BasicInfoData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BasicInfoData, string | null>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const updateField = (field: keyof BasicInfoData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched.has(field)) {
      validateField(field, value);
    }
  };

  const validateField = (field: keyof BasicInfoData, value: string) => {
    let error: string | null = null;
    switch (field) {
      case "firstName":
      case "lastName":
        error = validators.name(value);
        break;
      case "middleName":
        error = value ? validators.name(value) : null;
        break;
      case "email":
        error = validators.email(value);
        break;
      case "mobile":
        error = validators.mobile(value);
        break;
      case "dateOfBirth":
        error = validators.dateOfBirth(value);
        break;
      case "password":
        error = validators.password(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleBlur = (field: keyof BasicInfoData) => {
    setTouched((prev) => new Set(prev).add(field));
    validateField(field, form[field]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: (keyof BasicInfoData)[] = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "dateOfBirth",
      "password",
    ];
    let hasError = false;
    fields.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) hasError = true;
    });
    if (!hasError) onSubmit(form);
  };

  return (
    <Card className="w-full max-w-2xl border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-xl font-semibold text-gray-800">
          Create Account
        </CardTitle>
        <p className="text-center text-sm text-gray-500">Step 1 of 3: Basic Information</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              id="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(v) => updateField("firstName", v)}
              error={errors.firstName}
              placeholder="Juan"
              required
            />
            <FormField
              id="middleName"
              label="Middle Name"
              value={form.middleName}
              onChange={(v) => updateField("middleName", v)}
              error={errors.middleName}
              placeholder="Santos"
            />
            <FormField
              id="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(v) => updateField("lastName", v)}
              error={errors.lastName}
              placeholder="Dela Cruz"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(v) => updateField("dateOfBirth", v)}
              error={errors.dateOfBirth}
              required
            />
            <FormField
              id="mobile"
              label="Mobile Number"
              type="tel"
              value={form.mobile}
              onChange={(v) => updateField("mobile", v)}
              error={errors.mobile}
              placeholder="09171234567"
              required
            />
          </div>

          <FormField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
            error={errors.email}
            placeholder="juan@example.com"
            required
          />

          <div className="space-y-1">
            <FormField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(v) => updateField("password", v)}
              error={errors.password}
              placeholder="Min 8 characters"
              required
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </FormField>
            <PasswordMeter password={form.password} />
          </div>

          <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
