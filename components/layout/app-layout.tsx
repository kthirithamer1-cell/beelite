import * as React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { UserRole } from '@/types/database';

export async function AppLayout({
  children,
  role = 'TEACHER',
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.name || (role === 'TEACHER' ? 'Professeur Bassem' : 'Parent');
  const userEmail = user?.email || (role === 'TEACHER' ? 'bassem@beelite.com' : 'parent@beelite.com');
  const userRole = (user?.user_metadata?.role as UserRole) || role;

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Sidebar role={userRole} userName={userName} userEmail={userEmail} />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Navbar userName={userName} userEmail={userEmail} role={userRole} />
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto bg-white animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
