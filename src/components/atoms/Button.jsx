import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "text-white bg-primary-700 border border-transparent hover:bg-primary-800 focus:ring-primary-500 shadow-sm",
    secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm",
    ghost: "text-gray-600 bg-transparent border border-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-primary-500",
    danger: "text-white bg-red-600 border border-transparent hover:bg-red-700 focus:ring-red-500 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;