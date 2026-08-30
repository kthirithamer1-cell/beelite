'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarDays,
  CreditCard,
  UserCheck,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';

interface SidebarProps {
  role?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role = 'TEACHER', userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();

  const teacherNavItems = [
    { label: t('navDashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('navStudents'), href: '/students', icon: Users },
    { label: t('navGroups'), href: '/groups', icon: Layers },
    { label: t('navSessions'), href: '/sessions', icon: CalendarDays },
    { label: t('navPayments'), href: '/payments', icon: CreditCard },
  ];

  const parentNavItems = [
    { label: t('navMyChildren'), href: '/parent/dashboard', icon: Users },
    { label: t('navAttendance'), href: '/parent/attendance', icon: UserCheck },
    { label: t('navFees'), href: '/parent/payments', icon: CreditCard },
  ];

  const navItems = role === 'PARENT' ? parentNavItems : teacherNavItems;

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-md flex flex-col h-screen sticky top-0 z-30 transition-all shadow-xs">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5 border-b border-slate-200/60 dark:border-slate-800/60 justify-between bg-gradient-to-r from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900">
        <Link href={role === 'PARENT' ? '/parent/dashboard' : '/dashboard'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              {t('brandTitle')}{' '}
              <span className="text-blue-600 dark:text-blue-400">Elite</span>
            </div>
            <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              {t('brandSubtitle')}
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              item.href !== '/parent/dashboard' &&
              pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                isRTL ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Tunisia Academic Year Badge Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white dark:from-blue-950/40 dark:to-slate-800/60 p-3.5 rounded-2xl border border-blue-200/70 dark:border-blue-900/50 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              {t('tunisiaProgram')}
            </span>
            <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900/80 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-200 font-extrabold">
              {t('academicYear')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug font-medium">
            {t('schoolLevels')}
          </p>
        </div>
      </div>
    </aside>
  );
}
