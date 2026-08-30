'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User, ShieldCheck, GraduationCap, Sparkles, Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { toast } from 'sonner';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  role?: string;
}

export function Navbar({ userName = 'Prof. Bassem', userEmail = 'bassem@beelite.com', role = 'TEACHER' }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : lang === 'fr' ? 'Déconnexion réussie' : 'Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Logout error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isTeacher = role === 'TEACHER';

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية (تونس)', flag: '🇹🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="h-16 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between shadow-2xs">
      {/* Left section / Role pill */}
      <div className="flex items-center gap-3">
        <Badge variant={isTeacher ? 'blue' : 'success'} className="px-3 py-1 text-xs">
          {isTeacher ? <GraduationCap className="w-3.5 h-3.5 mr-1" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1" />}
          {isTeacher ? t('profBassem') : t('parentSpace')}
        </Badge>
        <span className="text-xs text-slate-200 hidden sm:inline-block">|</span>
        <span className="text-xs text-slate-500 font-extrabold hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-600" />
          {t('academyName')}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="rounded-xl h-9 px-2.5 text-xs font-bold gap-1.5 border-slate-200 hover:border-blue-300"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span className="uppercase">{lang}</span>
          </Button>

          {isLangMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLangMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Language / Langue / اللغة
                </div>
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLang(item.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      lang === item.code
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    {lang === item.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
            {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-black text-slate-900 leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="rounded-xl text-xs font-bold gap-1.5 ml-1 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('logout')}</span>
        </Button>
      </div>
    </header>
  );
}
