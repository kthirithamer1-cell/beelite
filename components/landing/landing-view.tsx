'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  CreditCard,
  MessageSquare,
  Languages,
  Check,
  HeartHandshake,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';

export function LandingView() {
  const { lang, setLang, t, isRTL } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية (تونس)', flag: '🇹🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-gradient-to-br from-blue-400/20 to-indigo-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-[32rem] h-[32rem] bg-gradient-to-tr from-emerald-400/15 to-teal-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-[28rem] h-[28rem] bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="h-20 border-b border-blue-100/70 backdrop-blur-xl sticky top-0 z-50 bg-white/85 shadow-2xs">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-glow-blue animate-pulse-glow">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                <span>{t('brandTitle')}</span>
                <span className="text-blue-600">Elite</span>
              </div>
              <span className="block text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
                {t('brandSubtitle')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="rounded-xl h-9 px-3 text-xs font-bold gap-1.5 border-blue-200/80 hover:border-blue-400 bg-white/80 shadow-2xs"
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
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-blue-100 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {languagesList.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLang(item.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          lang === item.code
                            ? 'bg-blue-50 text-blue-600 font-extrabold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base">{item.flag}</span>
                          <span>{item.label}</span>
                        </span>
                        {lang === item.code && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 bg-white/80 border-blue-200/80">
                {t('login')}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm" className="rounded-xl font-bold h-9 shadow-glow-blue">
                {t('heroAccessBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 max-w-5xl mx-auto">
        {/* Reassuring Tunisian Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full frost-widget text-blue-800 text-xs sm:text-sm font-extrabold mb-8 animate-float shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <HeartHandshake className="w-4 h-4 text-blue-600" />
          <span>{t('heroPill')}</span>
          <span className="text-blue-300">•</span>
          <span className="text-emerald-700 font-black flex items-center gap-1">
            <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            98% تـألّـق
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] sm:leading-[1.1] mb-6 max-w-4xl">
          {t('heroTitle1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
            {t('heroTitle2')}
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed font-medium">
          {t('heroSub')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base shadow-glow-blue font-black"
            >
              <span>{t('heroAccessBtn')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-extrabold border border-blue-200/90 text-blue-800 bg-white/90 hover:bg-blue-50 shadow-2xs"
            >
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              {t('heroParentBtn')}
            </Button>
          </Link>
        </div>

        {/* 3 Core Pillars with Warm Soft Frost Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right sm:text-inherit w-full mt-2">
          <Card className="p-7 text-right">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 flex items-center justify-center mb-5 border border-blue-200/80 shadow-2xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {t('pillar1Title')}
              </h3>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              {t('pillar1Sub')}
            </p>
          </Card>

          <Card className="p-7 text-right">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50/90 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-200/80 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {t('pillar2Title')}
              </h3>
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              {t('pillar2Sub')}
            </p>
          </Card>

          <Card className="p-7 text-right">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50/90 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-200/80 shadow-2xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {t('pillar3Title')}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              {t('pillar3Sub')}
            </p>
          </Card>
        </div>

        {/* Tunisian Trust Banner with Royal Sapphire & Emerald Theme */}
        <div className="w-full mt-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white text-right sm:text-inherit flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-800/30 border border-blue-500/30 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-black mb-2 border border-white/20">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              {t('levelsBannerTitle')}
            </div>
            <h4 className="text-xl sm:text-2xl font-black">{t('tunisiaProgram')}</h4>
            <p className="text-xs sm:text-sm text-blue-100 mt-1.5 font-medium max-w-xl">
              {t('levelsBannerSub')}
            </p>
          </div>

          <Link href="/login" className="relative z-10">
            <Button variant="white" size="lg" className="rounded-2xl font-black whitespace-nowrap shadow-xl">
              {t('exploreClassesBtn')}
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100/70 py-6 text-center text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-md">
        © 2026 Be Elite مع الأستاذ بسام. جميع الحقوق محفوظة • تونس 🇹🇳
      </footer>
    </div>
  );
}
