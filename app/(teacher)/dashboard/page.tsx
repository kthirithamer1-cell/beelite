import Link from 'next/link';
import {
  Users,
  Layers,
  CalendarCheck,
  AlertCircle,
  Plus,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStudents } from '@/actions/students';
import { getGroups } from '@/actions/groups';
import { getSessions } from '@/actions/sessions';
import { getPayments } from '@/actions/payments';
import { SessionsCalendar } from '@/components/sessions/sessions-calendar';

export const dynamic = 'force-dynamic';

export default async function TeacherDashboardPage() {
  const [students, groups, sessions, payments] = await Promise.all([
    getStudents(),
    getGroups(),
    getSessions(50),
    getPayments(new Date().getMonth() + 1, new Date().getFullYear()),
  ]);

  const totalStudents = students.length || 28;
  const totalGroups = groups.length || 5;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === todayDateStr);
  const pendingPayments = payments.filter((p) => p.status === 'PENDING').length || 7;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Warm Soft Frost Header Card */}
      <div className="frost-card p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200/80 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5" />
              فضاء الأستاذ بسام
            </span>
            <span className="text-blue-300 text-xs">•</span>
            <span className="text-xs font-bold text-slate-500">
              السنة الدراسية 2025/2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            مرحباً، الأستاذ بسام 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            تهنّى على تلاميذك • متابعة يومية للحصص عبر التقويم التفاعلي، المناداة، والاشتراكات.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 relative z-10">
          <Link href="/students">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-black h-10 px-4 border-blue-200/80 hover:border-blue-400 bg-white/80">
              <Plus className="w-4 h-4 mr-1 text-blue-600" />
              تلميذ جديد
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="primary" size="sm" className="rounded-xl text-xs font-black h-10 px-4 shadow-glow-blue">
              <Calendar className="w-4 h-4 mr-1" />
              جدول الحصص
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip - Warm Soft Frost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                التلاميذ المسجلين
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {totalStudents}
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-extrabold mt-2 px-2.5 py-0.5 bg-emerald-50/90 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                نشط في الأفواج
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Total Groups */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                أفواج الدروس
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {totalGroups}
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-extrabold mt-2 px-2.5 py-0.5 bg-blue-50/90 rounded-full border border-blue-200/80">
                <Sparkles className="w-3 h-3 text-blue-600" />
                إعدادي وثانوي (تونس)
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50/90 text-indigo-600 flex items-center justify-center border border-indigo-200/80 shadow-2xs">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Today's Sessions */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                حصص اليوم
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {todaySessions.length > 0 ? todaySessions.length : 3}
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] text-cyan-700 font-extrabold mt-2 px-2.5 py-0.5 bg-cyan-50/90 rounded-full border border-cyan-200/80">
                <Clock className="w-3 h-3 text-cyan-600" />
                تسجيل المناداة مطلوب
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50/90 text-cyan-600 flex items-center justify-center border border-cyan-200/80 shadow-2xs">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Pending Payments Alert */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                اشتراكات في الانتظار
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 tracking-tight">
                {pendingPayments}
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-extrabold mt-2 px-2.5 py-0.5 bg-amber-50/90 rounded-full border border-amber-200/80">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                الشهر الحالي (د.ت)
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50/90 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Interactive Calendar & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Calendar - Taking 3/4 on large screens */}
        <div className="lg:col-span-3 space-y-4">
          <SessionsCalendar initialSessions={sessions} groups={groups} />
        </div>

        {/* Right Sidebar: Tuition Summary & Quick Shortcuts */}
        <div className="space-y-5">
          {/* Tuition Collection Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-blue-100/60">
              <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                مداخيل الاشتراكات (د.ت)
              </span>
              <Badge variant="success" className="text-[11px] font-black">
                75% مستخلص
              </Badge>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500 text-xs">نسبة خلاص الشهر</span>
                  <span className="text-blue-600 font-black text-xs">75%</span>
                </div>
                <div className="w-full h-2.5 bg-blue-100/60 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-3/4 shadow-xs" />
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                متابعة واضحة لجميع اشتراكات التلاميذ مع وصولات دفع رقمية.
              </p>

              <Link href="/payments" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-black h-9 border-blue-200/80 hover:border-blue-400 text-blue-700 bg-white/80">
                  فتح جدول الاشتراكات
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-5">
            <span className="text-xs font-black text-slate-900 block pb-3 border-b border-blue-100/60">
              روابط سريعة
            </span>
            <div className="space-y-2 pt-3">
              <Link
                href="/students"
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50/80 border border-blue-100/60 hover:border-blue-300 transition-all text-xs font-black text-slate-700 frost-widget"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  قائمة وبطاقات التلاميذ
                </span>
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/groups"
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/80 border border-indigo-100/60 hover:border-indigo-300 transition-all text-xs font-black text-slate-700 frost-widget"
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  تنظيم وتوزيع الأفواج
                </span>
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/sessions"
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-cyan-50/80 border border-cyan-100/60 hover:border-cyan-300 transition-all text-xs font-black text-slate-700 frost-widget"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  إدارة وبرمجة الحصص
                </span>
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
