import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all ${
            error ? "border-red-500 focus:ring-red-500" : "border-stone-300"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
