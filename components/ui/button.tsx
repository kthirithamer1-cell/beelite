import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'white' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gradient-to-r from-blue-600 via-blue-650 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-glow-blue hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 focus:ring-blue-500 border border-blue-500/30',
      secondary:
        'bg-blue-50/90 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 focus:ring-blue-400',
      outline:
        'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-200 shadow-xs focus:ring-blue-500',
      ghost:
        'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-blue-400',
      white:
        'bg-white text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg shadow-black/5 hover:-translate-y-0.5 border border-slate-100 focus:ring-white',
      emerald:
        'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-glow-emerald hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 focus:ring-emerald-500 border border-emerald-500/30',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:shadow-red-600/20 focus:ring-red-500',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:shadow-emerald-600/20 focus:ring-emerald-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 h-8',
      md: 'px-4 py-2 text-xs sm:text-sm gap-2 h-10',
      lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 h-12 font-extrabold',
      icon: 'p-2 w-9 h-9',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
