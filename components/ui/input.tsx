import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 tracking-tight"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border ${
            error
              ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          } rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-2xs transition-all duration-200 focus:outline-none ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
