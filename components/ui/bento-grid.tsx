"use client";

import { ReactNode } from "react";

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function BentoGridItem({ 
  title, 
  description, 
  header, 
  icon, 
  className 
}: { 
  title?: string | ReactNode; 
  description?: string | ReactNode; 
  header?: ReactNode; 
  icon?: ReactNode; 
  className?: string;
}) {
  return (
    <div className={className}>
      {header}
      {icon}
      {title && <div>{title}</div>}
      {description && <div>{description}</div>}
    </div>
  );
}
