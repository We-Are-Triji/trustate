"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordMeter } from "@/components/auth/shared/password-meter";
import { validators } from "@/lib/validation";
import type { BasicInfoData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

interface BasicInfoFormProps {
  onSubmit: (data: BasicInfoData) => void;
  onDevBypass?: () => void;
  initialData?: BasicInfoData;
  isLoading?: boolean;
}

export function BasicInfoForm({ onSubmit, onDevBypass, initialData, isLoading }: BasicInfoFormProps) {
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

  const updateField = (field: keyof BasicInfoData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateField = (field: keyof BasicInfoData, value: string) => {
    let error: string | null = null;
    switch (field) {
      case "firstName":
      case "lastName":
        error = validators.name(value);
        break;
      case "email":
        error = validators.email(value);
        break;
      case "mobile":
        error = validators.mobile(value);
        break;
      case "password":
        error = validators.password(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: (keyof BasicInfoData)[] = ["firstName", "lastName", "email", "mobile", "password"];
    let valid = true;
    fields.forEach((f) => {
      if (!validateField(f, form[f])) valid = false;
    });
    if (!form.dateOfBirth) {
      setErrors((prev) => ({ ...prev, dateOfBirth: "Required" }));
      valid = false;
    }
    if (valid) onSubmit(form);
  };

  const inputClass = "h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10";

  return (
    <>
      <CardHeader className="pb-2 pt-6">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Create Account
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">Enter your personal information</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">First Name *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    onBlur={(e) => validateField("firstName", e.target.value)}
                    placeholder="Juan"
                    className={inputClass}
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Middle Name</label>
                  <input
                    value={form.middleName}
                    onChange={(e) => updateField("middleName", e.target.value)}
                    placeholder="Santos"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Last Name *</label>
                <input
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  placeholder="Dela Cruz"
                  className={inputClass}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Nationality *</label>
                <input
                  value={form.nationality}
                  onChange={(e) => updateField("nationality", e.target.value)}
                  placeholder="Filipino"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Date of Birth *</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={form.dateOfBirth ? new Date(form.dateOfBirth).getMonth() : ""}
                    onChange={(e) => {
                      const month = parseInt(e.target.value);
                      const current = form.dateOfBirth ? new Date(form.dateOfBirth) : new Date(2000, 0, 1);
                      current.setMonth(month);
                      updateField("dateOfBirth", current.toISOString());
                    }}
                    className={`${inputClass} px-2`}
                  >
                    <option value="" disabled>Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <select
                    value={form.dateOfBirth ? new Date(form.dateOfBirth).getDate() : ""}
                    onChange={(e) => {
                      const day = parseInt(e.target.value);
                      const current = form.dateOfBirth ? new Date(form.dateOfBirth) : new Date(2000, 0, 1);
                      current.setDate(day);
                      updateField("dateOfBirth", current.toISOString());
                    }}
                    className={`${inputClass} px-2`}
                  >
                    <option value="" disabled>Day</option>
                    {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                  <select
                    value={form.dateOfBirth ? new Date(form.dateOfBirth).getFullYear() : ""}
                    onChange={(e) => {
                      const year = parseInt(e.target.value);
                      const current = form.dateOfBirth ? new Date(form.dateOfBirth) : new Date(2000, 0, 1);
                      current.setFullYear(year);
                      updateField("dateOfBirth", current.toISOString());
                    }}
                    className={`${inputClass} px-2`}
                  >
                    <option value="" disabled>Year</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Mobile Number *</label>
                <input
                  value={form.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  onBlur={(e) => validateField("mobile", e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                  className={inputClass}
                />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={(e) => validateField("email", e.target.value)}
                  placeholder="juan@example.com"
                  className={inputClass}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={(e) => validateField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PasswordMeter password={form.password} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#0247ae] hover:text-[#ffce08]">
                Sign in
              </Link>
            </p>
            <div className="flex gap-2">
              {isDev && onDevBypass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onDevBypass}
                  className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 h-9"
                >
                  [DEV] Skip
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#0247ae] hover:bg-[#023a8a] px-6 h-9 text-sm font-semibold disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
}
