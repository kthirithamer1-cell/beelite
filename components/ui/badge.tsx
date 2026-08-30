import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'blue' | 'emerald' | 'glow';
}

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80 shadow-2xs',
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 shadow-xs shadow-blue-500/25',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500/30 shadow-xs shadow-emerald-500/25',
    secondary: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-2xs',
    success: 'bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/70 shadow-2xs',
    warning: 'bg-amber-50/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/70 shadow-2xs',
    danger: 'bg-rose-50/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/70 shadow-2xs',
    outline: 'border border-slate-200 dark:border-slate-800 bg-white/50 text-slate-700 dark:text-slate-300',
    glow: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse-glow',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
