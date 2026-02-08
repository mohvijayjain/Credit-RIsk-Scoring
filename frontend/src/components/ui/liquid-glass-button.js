import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const liquidButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl border border-pink-600",
        destructive:
          "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-200",
        outline:
          "border border-gray-300 bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-md",
        secondary:
          "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 backdrop-blur-md border border-gray-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const LiquidButton = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(liquidButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LiquidButton.displayName = "LiquidButton";

export { LiquidButton, liquidButtonVariants };
