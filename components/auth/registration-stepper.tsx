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
                  ? "bg-green-600 text-white"
                  : step.current
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.completed ? <Check size={16} /> : index + 1}
            </div>
            <span
              className={`text-sm hidden sm:block ${
                step.current ? "font-medium text-gray-800" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-2 ${
                step.completed ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
