"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CalendarIcon, Upload, CheckCircle, User, CreditCard, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PasswordMeter } from "@/components/auth/shared/password-meter";
import { validators } from "@/lib/validation";
import { PH_VALID_IDS, type BasicInfoData, type PhilippineID } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface BasicInfoIdFormProps {
  onSubmit: (basicInfo: BasicInfoData, idData: { idType: PhilippineID; idImage: File }) => void;
  onDevBypass?: () => void;
  initialBasicInfo?: BasicInfoData;
}

export function BasicInfoIdForm({ onSubmit, onDevBypass, initialBasicInfo }: BasicInfoIdFormProps) {
  const [form, setForm] = useState<BasicInfoData>(
    initialBasicInfo || {
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
  const [idType, setIdType] = useState<PhilippineID | "">("");
  const [idImage, setIdImage] = useState<File | null>(null);

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
      case "middleName":
        error = value ? validators.name(value) : null;
        break;
      case "nationality":
        error = value ? null : "Required";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: (keyof BasicInfoData)[] = [
      "firstName", "lastName", "nationality", "email", "mobile", "dateOfBirth", "password",
    ];
    let hasError = false;
    fields.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) hasError = true;
    });
    if (!idType || !idImage) hasError = true;
    if (!hasError && idType && idImage) {
      onSubmit(form, { idType: idType as PhilippineID, idImage });
    }
  };

  const inputClass = (hasError?: boolean) => 
    `h-9 w-full rounded-lg border-2 bg-white px-3 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none ${
      hasError 
        ? "border-red-400 focus:border-red-500" 
        : "border-gray-200 focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
    }`;

  return (
    <>
      <CardHeader className="pb-1 pt-5 text-center animate-[fadeInUp_0.5s_ease-out]">
        <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
          Create Account
        </CardTitle>
        <p className="text-gray-500 text-sm">Enter your details and upload your ID</p>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-4">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="grid grid-cols-2 gap-x-8 flex-1">
            {/* Left Column - Personal Information */}
            <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <User className="h-4 w-4 text-[#0247ae]" />
                <h3 className="font-semibold text-[#0247ae] text-sm">Personal Information</h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">First Name *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Juan"
                    className={inputClass(!!errors.firstName)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Middle Name</label>
                  <input
                    value={form.middleName}
                    onChange={(e) => updateField("middleName", e.target.value)}
                    placeholder="Santos"
                    className={inputClass()}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Last Name *</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Dela Cruz"
                    className={inputClass(!!errors.lastName)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Nationality *</label>
                  <input
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    placeholder="Filipino"
                    className={inputClass(!!errors.nationality)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Date of Birth *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`h-9 w-full rounded-lg border-2 bg-white px-3 text-sm text-left flex items-center transition-all duration-200 focus:outline-none ${
                          errors.dateOfBirth 
                            ? "border-red-400" 
                            : "border-gray-200 hover:border-gray-300 focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
                        } ${!form.dateOfBirth ? "text-gray-400" : "text-gray-700"}`}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-400" />
                        {form.dateOfBirth ? format(new Date(form.dateOfBirth), "PP") : "Select date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.dateOfBirth ? new Date(form.dateOfBirth) : undefined}
                        onSelect={(date) => date && updateField("dateOfBirth", format(date, "yyyy-MM-dd"))}
                        defaultMonth={new Date(2000, 0)}
                        fromYear={1920}
                        toYear={new Date().getFullYear() - 18}
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Mobile *</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="09171234567"
                    className={inputClass(!!errors.mobile)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="juan@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className={`${inputClass(!!errors.password)} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0247ae] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordMeter password={form.password} />
              </div>
            </div>

            {/* Right Column - ID Verification */}
            <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <CreditCard className="h-4 w-4 text-[#0247ae]" />
                <h3 className="font-semibold text-[#0247ae] text-sm">ID Verification</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="ml-auto text-gray-400 hover:text-[#0247ae] transition-colors">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs bg-[#0247ae] text-white p-3 rounded-lg">
                      <p className="font-semibold mb-1">Why do we need your ID?</p>
                      <p className="text-xs leading-relaxed opacity-90">
                        We verify your identity to ensure secure transactions and protect all users on our platform. 
                        Your ID helps us comply with real estate regulations and prevent fraud.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Government ID Type *</label>
                <Select value={idType} onValueChange={(v) => { setIdType(v as PhilippineID); setIdImage(null); }}>
                  <SelectTrigger className="h-9 border-2 border-gray-200 bg-white text-sm focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PH_VALID_IDS.map((id) => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {idType ? (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Upload {idType} *</label>
                  <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-[#0247ae] hover:bg-[#0247ae]/5 transition-all duration-200 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setIdImage(e.target.files[0])}
                      className="hidden"
                    />
                    {idImage ? (
                      <div className="flex flex-col items-center gap-1 text-green-600">
                        <CheckCircle size={20} />
                        <span className="text-xs font-medium">File uploaded</span>
                        <span className="text-xs text-gray-500 truncate max-w-[180px]">{idImage.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-gray-400 group-hover:text-[#0247ae] transition-colors" />
                        <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-[#0247ae] transition-colors">
                          Click to upload
                        </span>
                        <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="flex h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/30">
                  <CreditCard className="h-5 w-5 text-gray-300" />
                  <span className="mt-1 text-xs text-gray-400">Select an ID type first</span>
                </div>
              )}

              <div className="rounded-lg bg-[#0247ae]/5 p-2.5 border border-[#0247ae]/10">
                <p className="text-xs font-medium text-[#0247ae] mb-1">Accepted IDs</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Passport, Driver&apos;s License, SSS, UMID, PhilHealth, Voter&apos;s ID, PRC, Postal ID, PhilSys
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0247ae] hover:text-[#ffce08] transition-colors">
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
                className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200"
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
}
