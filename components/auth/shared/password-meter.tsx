"use client";

import { getPasswordStrength, getStrengthLabel, getStrengthColor } from "@/lib/validation";

interface PasswordMeterProps {
  password: string;
}

export function PasswordMeter({ password }: PasswordMeterProps) {
  const strength = getPasswordStrength(password);
  const label = getStrengthLabel(strength);
  const color = getStrengthColor(strength);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
