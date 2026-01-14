"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface RegistrationContainerProps {
  children: ReactNode;
}

export function RegistrationContainer({ children }: RegistrationContainerProps) {
  return (
    <Card className="w-full max-w-5xl border-0 bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden">
      {children}
    </Card>
  );
}
