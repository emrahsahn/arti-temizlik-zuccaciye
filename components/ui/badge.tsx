import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "red" | "blue" | "success" | "warning" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantStyles = {
    default: "bg-stone-100 text-stone-800 border-stone-200",
    red: "bg-rose-50 text-brand-red border-rose-200",
    blue: "bg-sky-50 text-brand-blue border-sky-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    outline: "bg-transparent text-stone-600 border-stone-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
