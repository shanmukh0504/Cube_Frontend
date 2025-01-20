import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/shadcn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white border-gray-700 shadow-lg bg-gray-800 hover:bg-gray-700",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-md",
        outline:
          "border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-inner",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-blue-600 underline hover:text-blue-500",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs rounded-md",
        default: "h-10 px-5 py-2 rounded-lg",
        lg: "h-12 px-6 py-2.5 rounded-lg text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
