'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle2,
  BookOpen,
  Users,
  Filter,
  Sparkles,
  Layers,
  CalendarDays,
  ListFilter,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { createSession } from '@/actions/sessions';
import { Group } from '@/types/database';
import { toast } from 'sonner';

interface SessionItem {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic?: string | null;
  group_id?: string;
  group?: {
    id?: string;
    name: string;
    level?: {
      name: string;
    };
  };
}

interface SessionsCalendarProps {
  initialSessions: SessionItem[];
  groups: Group[];
  compact?: boolean;
  showTitle?: boolean;
}

const ARABIC_MONTHS = [
  'جانفي (يناير)',
  'فيفري (فبراير)',
  'مارس',
  'أفريل (أبريل)',
  'ماي (مايو)',
  'جوان (يونيو)',
  'جويلية (يوليو)',
  'أوت (أغسطس)',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const WEEKDAYS = [
  { ar: 'الإثنين', fr: 'Lun', short: 'ن' },
  { ar: 'الثلاثاء', fr: 'Mar', short: 'ث' },
  { ar: 'الأربعاء', fr: 'Mer', short: 'ر' },
  { ar: 'الخميس', fr: 'Jeu', short: 'خ' },
  { ar: 'الجمعة', fr: 'Ven', short: 'ج' },
  { ar: 'السبت', fr: 'Sam', short: 'س' },
  { ar: 'الأحد', fr: 'Dim', short: 'ح' },
];

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function SessionsCalendar({
  initialSessions,
  groups,
  compact = false,
  showTitle = true,
}: SessionsCalendarProps) {
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [selectedDateKey, setSelectedDateKey] = React.useState<string>(todayKey);
  const [sessions, setSessions] = React.useState<SessionItem[]>(initialSessions);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>('ALL');
  const [viewMode, setViewMode] = React.useState<'calendar' | 'list'>('calendar');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize demo data if no initial sessions provided
  React.useEffect(() => {
    if (initialSessions && initialSessions.length > 0) {
      setSessions(initialSessions);
    } else {
      const curYear = today.getFullYear();
      const curMonth = today.getMonth();
      const curDay = today.getDate();

      const demo = [
        {
          id: 'demo-1',
          date: formatDateKey(curYear, curMonth, curDay),
          start_time: '15:30',
          end_time: '17:00',
          topic: 'مراجعة شاملة لاختبار الثلاثي والتمارين النموذجية',
          group_id: groups[0]?.id || 'g1',
          group: { name: 'فوج 9 أساسي (أ)', level: { name: '9ème année' } },
        },
        {
          id: 'demo-2',
          date: formatDateKey(curYear, curMonth, curDay),
          start_time: '17:30',
          end_time: '19:00',
          topic: 'تحضير الباكالوريا : منهجية المسائل وتمارين التأليف',
          group_id: groups[1]?.id || 'g2',
          group: { name: 'باكالوريا علوم ورياضيات', level: { name: 'Baccalauréat' } },
        },
        {
          id: 'demo-3',
          date: formatDateKey(curYear, curMonth, Math.min(curDay + 1, 28)),
          start_time: '14:00',
          end_time: '15:30',
          topic: 'الهندسة الفضائية وحساب المتجهات',
          group_id: groups[0]?.id || 'g1',
          group: { name: 'فوج 3 ثانوي علوم', level: { name: '3ème secondaire' } },
        },
        {
          id: 'demo-4',
          date: formatDateKey(curYear, curMonth, Math.min(curDay + 3, 28)),
          start_time: '16:00',
          end_time: '17:30',
          topic: 'دعم وتقوية المفاهيم الأساسية وحل مواضيع سابقة',
          group_id: groups[1]?.id || 'g2',
          group: { name: 'باكالوريا اقتصاد وتصرف', level: { name: 'Baccalauréat' } },
        },
      ];
      setSessions(demo);
    }
  }, [initialSessions, groups]);

  // Calendar Calculation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Adjust so Monday is 0, Sunday is 6
  let firstDayOfWeek = new Date(year, month, 1).getDay() - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6;

  const prevMonthDays = new Date(year, month, 0).getDate();

  // Filter sessions by selected group
  const filteredSessions = React.useMemo(() => {
    if (selectedGroupId === 'ALL') return sessions;
    return sessions.filter((s) => s.group_id === selectedGroupId || s.group?.id === selectedGroupId);
  }, [sessions, selectedGroupId]);

  // Map of sessions per date string
  const sessionsByDate = React.useMemo(() => {
    const map: Record<string, SessionItem[]> = {};
    filteredSessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [filteredSessions]);

  // Sessions for the currently selected date
  const selectedDaySessions = React.useMemo(() => {
    return sessionsByDate[selectedDateKey] || [];
  }, [sessionsByDate, selectedDateKey]);

  // Total sessions this month
  const monthSessionsCount = React.useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return filteredSessions.filter((s) => s.date.startsWith(prefix)).length;
  }, [filteredSessions, year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateKey(now.toISOString().split('T')[0]);
  };

  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await createSession(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('تمت برمجة الحصة بنجاح !');
      setIsModalOpen(false);
      if (res.session) {
        setSessions((prev) => [res.session, ...prev]);
        setSelectedDateKey(res.session.date);
      }
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ أثناء حفظ الحصة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected date formatted in Arabic
  const formattedSelectedDate = React.useMemo(() => {
    try {
      const [y, m, d] = selectedDateKey.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('ar-TN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return selectedDateKey;
    }
  }, [selectedDateKey]);

  return (
    <div className="space-y-4">
      {/* Calendar Top Header */}
      <div className="frost-card p-4 sm:p-5 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-glow-blue shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  تقويم وجدول الحصص
                </h2>
                <Badge variant="blue" className="text-[11px] font-black px-2 py-0.5">
                  {monthSessionsCount} حصة هذا الشهر
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تصفح جدول الأستاذ بسام باليوم والشهر مع إمكانية تسجيل الحضور الفوري
              </p>
            </div>
          </div>

          {/* Controls: Group filter & Add session button */}
          <div className="flex items-center flex-wrap gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 bg-blue-50/80 dark:bg-slate-800/80 rounded-xl border border-blue-200/60">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                التقويم
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                القائمة
              </button>
            </div>

            {/* Filter by Group */}
            {groups.length > 0 && (
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="ALL">جميع الأفواج ({sessions.length})</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl text-xs font-black h-9 px-3.5 shadow-glow-blue"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              حصة جديدة
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Calendar Grid + Selected Day Schedule */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Month Calendar Grid (7 Cols on desktop) */}
          <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              {/* Calendar Navigation Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-blue-100/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {ARABIC_MONTHS[month]} {year}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToday}
                    className="text-[11px] font-black h-7 px-2 text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 rounded-lg"
                  >
                    اليوم
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="الشهر التالي"
                    className="w-8 h-8 rounded-xl border border-blue-200/70 flex items-center justify-center hover:bg-blue-50 text-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="الشهر السابق"
                    className="w-8 h-8 rounded-xl border border-blue-200/70 flex items-center justify-center hover:bg-blue-50 text-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-2">
                {WEEKDAYS.map((day, idx) => (
                  <div
                    key={idx}
                    className="py-1 text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg"
                  >
                    <span className="hidden sm:inline">{day.ar}</span>
                    <span className="sm:hidden">{day.short}</span>
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {/* Previous month filler days */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
                  const dayNum = prevMonthDays - firstDayOfWeek + idx + 1;
                  return (
                    <div
                      key={`prev-${idx}`}
                      className="min-h-[58px] sm:min-h-[72px] p-1.5 rounded-xl border border-dashed border-slate-200/40 dark:border-slate-800/40 opacity-40 bg-slate-50/40 dark:bg-slate-900/20 text-slate-400 flex flex-col justify-between"
                    >
                      <span className="text-[10px] font-bold">{dayNum}</span>
                    </div>
                  );
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = formatDateKey(year, month, dayNum);
                  const isToday = dateStr === todayKey;
                  const isSelected = dateStr === selectedDateKey;
                  const daySessions = sessionsByDate[dateStr] || [];
                  const hasSessions = daySessions.length > 0;

                  return (
                    <button
                      key={`cur-${dayNum}`}
                      type="button"
                      onClick={() => setSelectedDateKey(dateStr)}
                      className={`min-h-[58px] sm:min-h-[72px] p-1.5 rounded-2xl border text-right transition-all flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-[1.02] z-10'
                          : isToday
                          ? 'bg-blue-50/90 text-blue-900 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700'
                          : hasSessions
                          ? 'bg-white dark:bg-slate-900 border-blue-200/80 hover:border-blue-400 hover:bg-blue-50/30'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-black ${
                            isSelected
                              ? 'text-white'
                              : isToday
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {isToday && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        )}

                        {hasSessions && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                            }`}
                          >
                            {daySessions.length}
                          </span>
                        )}
                      </div>

                      {/* Sessions Preview Pills inside Cell */}
                      <div className="w-full space-y-0.5 overflow-hidden">
                        {daySessions.slice(0, 2).map((s, sIdx) => (
                          <div
                            key={sIdx}
                            className={`text-[9px] truncate px-1 py-0.5 rounded font-bold text-left leading-tight ${
                              isSelected
                                ? 'bg-blue-700/80 text-blue-100'
                                : 'bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300'
                            }`}
                          >
                            <span className="font-mono">{s.start_time}</span>
                            <span className="mx-0.5">•</span>
                            <span>{s.group?.name?.replace('Groupe ', '') || 'حصة'}</span>
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <p
                            className={`text-[8px] font-extrabold text-center ${
                              isSelected ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            +{daySessions.length - 2} المزيد
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendar Legend / Quick Tips */}
            <div className="pt-3 mt-3 border-t border-blue-100/60 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  يوم محدد
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-300 inline-block" />
                  اليوم الحالي
                </span>
              </div>
              <span>اضغط على أي يوم لعرض حصصه أو برمجتها</span>
            </div>
          </Card>

          {/* Selected Day Schedule & Attendance Panel (5 Cols) */}
          <Card className="lg:col-span-5 flex flex-col">
            <CardHeader className="py-4 px-5 border-b border-blue-100/60 bg-blue-50/40 dark:bg-slate-900/40 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>برنامج اليوم المختار</span>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                    {formattedSelectedDate}
                  </CardTitle>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-xl text-xs font-black h-8 px-2.5 border-blue-200 hover:border-blue-400 bg-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  إضافة
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              {selectedDaySessions.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                  {selectedDaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-2xl border border-blue-150/80 bg-white/90 dark:bg-slate-900/90 shadow-2xs hover:border-blue-400 transition-all frost-widget flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          {/* Time badge */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center font-black shrink-0 shadow-glow-blue">
                            <span className="text-[11px] leading-tight font-mono">
                              {session.start_time}
                            </span>
                            <span className="text-[9px] text-blue-200 leading-tight font-mono">
                              {session.end_time}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                                {session.group?.name || 'فوج الدروس'}
                              </h4>
                              {session.group?.level?.name && (
                                <Badge variant="blue" className="text-[9px] py-0.5 px-1.5 font-bold">
                                  {session.group.level.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium line-clamp-2">
                              <BookOpen className="w-3 h-3 text-blue-600 shrink-0" />
                              {session.topic || 'مراجعة وتطبيقات'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar: Attendance Button */}
                      <div className="pt-2 border-t border-blue-100/50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-500" />
                          تسجيل الغيابات والملاحظات
                        </span>
                        <Link href={`/sessions/${session.id}/attendance`}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-xl text-xs font-black h-8 px-3 shadow-glow-blue"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            المناداة والحضور
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 flex flex-col items-center justify-center flex-1">
                  <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 mb-3 shadow-2xs">
                    <CalendarIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">
                    لا توجد حصص مبرمجة في هذا اليوم
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] font-medium">
                    يمكنك برمجة حصة دراسية جديدة لهذا اليوم بضغطة زر.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 rounded-xl text-xs font-black h-9 px-4 border-blue-300 text-blue-700 hover:bg-blue-50 bg-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    برمجة حصة لهذا اليوم
                  </Button>
                </div>
              )}

              {/* Bottom Quick Insight */}
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/50 border border-blue-150/60 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  مجموع حصص اليوم:
                </span>
                <span className="font-black text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-blue-200/60 shadow-2xs">
                  {selectedDaySessions.length} حصة
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List / Table View Mode */
        <Card className="p-5">
          <div className="space-y-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl border border-blue-150/70 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 frost-widget shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center font-black shrink-0 shadow-glow-blue">
                      <span className="text-xs leading-tight font-mono">{session.start_time}</span>
                      <span className="text-[10px] text-blue-200 leading-tight font-mono">
                        {session.end_time}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                          {session.group?.name || 'فوج الدروس'}
                        </h4>
                        <Badge variant="blue" className="text-[10px] py-0.5 px-2 font-black">
                          {session.group?.level?.name || 'مستوى'}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">
                          • {session.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        {session.topic || 'حصة دروس ودعم'}
                      </p>
                    </div>
                  </div>

                  <Link href={`/sessions/${session.id}/attendance`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-xl w-full sm:w-auto text-xs font-black h-9 px-4 shadow-glow-blue"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      تسجيل الحضور
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">لا توجد حصص مسجلة حالياً</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Modal: Schedule a New Session */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="برمجة حصة جديدة للأستاذ بسام"
        description="حدد الفوج والتاريخ وتوقيت الحصة لمتابعة حضور التلاميذ."
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              فوج الدروس *
            </label>
            <select
              name="groupId"
              required
              defaultValue={groups[0]?.id}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.level?.name || 'مستوى'})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="تاريخ الحصة *"
            name="date"
            type="date"
            defaultValue={selectedDateKey}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="توقيت البداية *"
              name="startTime"
              type="time"
              defaultValue="15:30"
              required
            />
            <Input
              label="توقيت النهاية *"
              name="endTime"
              type="time"
              defaultValue="17:00"
              required
            />
          </div>

          <Input
            label="موضوع / هدف الحصة"
            name="topic"
            placeholder="مثال: مراجعة شاملة لفرض التأليف، تمارين الهندسة..."
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl font-bold"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="rounded-xl font-black shadow-glow-blue"
            >
              تأكيد وبرمجة الحصة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
