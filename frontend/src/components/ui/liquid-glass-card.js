import * as React from "react";
import { cn } from "../../lib/utils";

const LiquidCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 text-card-foreground shadow-2xl",
      className
    )}
    {...props}
  />
));
LiquidCard.displayName = "LiquidCard";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { LiquidCard, CardHeader, CardContent };
