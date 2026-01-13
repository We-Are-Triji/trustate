"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormField } from "./form-field";
import { PasswordMeter } from "./password-meter";
import { validators } from "@/lib/validation";
import type { BasicInfoData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface BasicInfoFormProps {
  onSubmit: (data: BasicInfoData) => void;
  onDevBypass?: () => void;
  initialData?: BasicInfoData;
}

export function BasicInfoForm({ onSubmit, onDevBypass, initialData }: BasicInfoFormProps) {
  const [form, setForm] = useState<BasicInfoData>(
    initialData || {
      firstName: "",
      middleName: "",
      lastName: "",
      nationality: "",
      dateOfBirth: "",
      mobile: "",
      email: "",
      password: "",
    }
  );
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
      case "nationality":
        error = value ? null : "Nationality is required";
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
      "nationality",
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
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Create Account
        </CardTitle>
        <p className="text-sm text-gray-500">Step 1 of 3: Basic Information</p>
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

          <div className="grid grid-cols-3 gap-3">
            <FormField
              id="nationality"
              label="Nationality"
              value={form.nationality}
              onChange={(v) => updateField("nationality", v)}
              error={errors.nationality}
              placeholder="Filipino"
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal border-[#E2E8F0] ${
                      !form.dateOfBirth && "text-muted-foreground"
                    } ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.dateOfBirth ? format(new Date(form.dateOfBirth), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.dateOfBirth ? new Date(form.dateOfBirth) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM-dd");
                        updateField("dateOfBirth", formatted);
                      }
                    }}
                    defaultMonth={new Date(2000, 0)}
                    fromYear={1920}
                    toYear={new Date().getFullYear() - 18}
                    captionLayout="dropdown"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>
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
              placeholder="Create a strong password"
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
            <p className="text-xs text-gray-500 mt-1">
              Use 8+ characters with uppercase, lowercase, numbers, and symbols for a strong password.
            </p>
          </div>

          <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 active:bg-gray-950">
            Continue
          </Button>

          {isDev && onDevBypass && (
            <Button
              type="button"
              variant="outline"
              onClick={onDevBypass}
              className="w-full border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 active:bg-orange-100"
            >
              [DEV] Skip OTP Verification
            </Button>
          )}

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-800 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
