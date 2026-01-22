"use client";

import { Button, ButtonProps } from "@/components/ui/button";

export function Button({ children, ...props }: ButtonProps & { borderRadius?: string; containerClassName?: string; borderClassName?: string }) {
  return <Button {...props}>{children}</Button>;
}

export { Button as MovingBorderButton };
