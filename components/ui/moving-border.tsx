"use client";

import { Button as BaseButton } from "@/components/ui/button";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof BaseButton>;

export function Button({ children, ...props }: ButtonProps & { borderRadius?: string; containerClassName?: string; borderClassName?: string }) {
  return <BaseButton {...props}>{children}</BaseButton>;
}

export { Button as MovingBorderButton };
