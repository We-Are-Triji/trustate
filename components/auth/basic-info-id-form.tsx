"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CalendarIcon, Upload, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordMeter } from "./password-meter";
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

  return (
    <>
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl font-semibold text-gray-800">Create Account</CardTitle>
        <p className="text-sm text-gray-500">Enter your details and upload your ID</p>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Juan"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] ${errors.firstName ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Middle Name</Label>
                  <Input
                    value={form.middleName}
                    onChange={(e) => updateField("middleName", e.target.value)}
                    placeholder="Santos"
                    className="border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Last Name *</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Dela Cruz"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] ${errors.lastName ? "border-red-500" : ""}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Nationality *</Label>
                  <Input
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    placeholder="Filipino"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] ${errors.nationality ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Date of Birth *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-[#E2E8F0] ${
                          !form.dateOfBirth && "text-muted-foreground"
                        } ${errors.dateOfBirth ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.dateOfBirth ? format(new Date(form.dateOfBirth), "PP") : "Select"}
                      </Button>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Mobile *</Label>
                  <Input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="09171234567"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] ${errors.mobile ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="juan@example.com"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className={`border-[#E2E8F0] bg-[#F8FAFC] pr-10 ${errors.password ? "border-red-500" : ""}`}
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
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Government ID Type *</Label>
                <Select value={idType} onValueChange={(v) => { setIdType(v as PhilippineID); setIdImage(null); }}>
                  <SelectTrigger className="border-[#E2E8F0] bg-[#F8FAFC]">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PH_VALID_IDS.map((id) => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {idType && (
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Upload {idType} *</Label>
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setIdImage(e.target.files[0])}
                      className="hidden"
                    />
                    {idImage ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="text-sm truncate max-w-[200px]">{idImage.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload your {idType}</span>
                      </>
                    )}
                  </label>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Accepted IDs</p>
                <p>Philippine Passport, Driver's License, UMID, National ID, and other government-issued IDs.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-gray-800 hover:underline">Sign in</Link>
            </p>
            <div className="flex gap-3">
              {isDev && onDevBypass && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDevBypass}
                  className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50"
                >
                  [DEV] Skip
                </Button>
              )}
              <Button type="submit" className="bg-gray-800 hover:bg-gray-900 active:bg-gray-950 px-8">
                Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
}
