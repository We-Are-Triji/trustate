"use client";

import { ReactNode } from "react";

export function InfiniteMovingCards({ 
  items, 
  direction, 
  speed, 
  pauseOnHover, 
  className 
}: { 
  items: any[]; 
  direction?: string; 
  speed?: string; 
  pauseOnHover?: boolean; 
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((item, idx) => (
        <div key={idx}>{item.quote || item.name || JSON.stringify(item)}</div>
      ))}
    </div>
  );
}
