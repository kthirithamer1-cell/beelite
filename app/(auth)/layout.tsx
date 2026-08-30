import * as React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-slate-900">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
