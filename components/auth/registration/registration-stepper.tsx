"use client";

import { Check } from "lucide-react";

interface Step {
  label: string;
  completed: boolean;
  current: boolean;
}

interface RegistrationStepperProps {
  steps: Step[];
}

export function RegistrationStepper({ steps }: RegistrationStepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step.completed
                  ? "bg-[#ffce08] text-[#0247ae]"
                  : step.current
                  ? "bg-[#ffce08] text-[#0247ae]"
                  : "bg-white/30 text-white/70"
              }`}
            >
              {step.completed ? <Check size={16} /> : index + 1}
            </div>
            <span
              className={`text-sm hidden sm:block ${
                step.current ? "font-medium text-[#ffce08]" : "text-white/70"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-2 ${
                step.completed ? "bg-[#ffce08]" : "bg-white/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
