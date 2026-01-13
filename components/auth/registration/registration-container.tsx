"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface RegistrationContainerProps {
  children: ReactNode;
}

export function RegistrationContainer({ children }: RegistrationContainerProps) {
  return (
    <Card className="w-full max-w-5xl min-h-[500px] border-[#E2E8F0] bg-white shadow-sm flex flex-col">
      {children}
    </Card>
  );
}
