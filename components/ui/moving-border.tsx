"use client";

import { Button as BaseButton, ButtonProps } from "@/components/ui/button";

export function Button({ children, ...props }: ButtonProps & { borderRadius?: string; containerClassName?: string; borderClassName?: string }) {
  return <BaseButton {...props}>{children}</BaseButton>;
}

export { Button as MovingBorderButton };
