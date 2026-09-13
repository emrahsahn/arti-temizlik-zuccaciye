import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-brand-red text-white hover:bg-brand-redDark focus-visible:ring-brand-red shadow-sm",
      secondary:
        "bg-brand-blue text-white hover:bg-brand-blueDark focus-visible:ring-brand-blue shadow-sm",
      outline:
        "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus-visible:ring-stone-400",
      ghost:
        "text-stone-700 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
