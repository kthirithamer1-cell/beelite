import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Award,
  HeartHandshake,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let children: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('parent_students')
      .select('*, student:students(*, level:levels(*), group:groups(*), attendances(*), payments(*), notes(*))')
      .eq('parent_id', user.id);

    if (data && data.length > 0) {
      children = data.map((d: any) => d.student);
    }
  }

  // Demonstration children with Tunisian context
  if (children.length === 0) {
    children = [
      {
        id: 'child-1',
        first_name: 'محمد',
        last_name: 'بن علي',
        level: { name: '9ème de base (النوفيام)' },
        group: { name: 'فوج 9 أساسي (أ)' },
        attendanceRate: 96,
        paymentStatus: 'PAID',
        latestNote: 'محمد تلميذ ممتاز ومواظب. التمارين متاع المراجعة تخدمت بإتقان والنتائج ممتازة في الديفوار.',
        attendances: [
          { status: 'PRESENT', date: '2026-08-20' },
          { status: 'PRESENT', date: '2026-08-18' },
          { status: 'PRESENT', date: '2026-08-15' },
        ],
      },
    ];
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Warm Soft Frost Header Card */}
      <div className="frost-card p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-800 text-xs font-black border border-emerald-200/80 shadow-2xs">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              فضاء الأولياء • تهنّى على ولدك
            </span>
            <span className="text-blue-300 text-xs">•</span>
            <span className="text-xs font-bold text-slate-500">
              متابعة بيداغوجية مستمرة
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            متابعة قراية ولدك • مع الأستاذ بسام
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            ولدك بين إيدينا • متابعة مباشرة للحضور، ملاحظات الأستاذ، ووضعية الاشتراكات.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Badge variant="blue" className="px-3.5 py-1.5 text-xs font-black shadow-glow-blue">
            {children.length} تلميذ متابع
          </Badge>
        </div>
      </div>

      {/* Children Overview Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          قائمة الأبناء المتابعين
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {children.map((child: any) => {
            const isPaid = child.paymentStatus === 'PAID';
            const attRate = child.attendanceRate || 96;

            return (
              <Card
                key={child.id}
                className="p-6 space-y-4"
              >
                {/* Header child */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-blue-100/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-center font-black text-base shadow-glow-blue">
                      {child.first_name?.charAt(0)}
                      {child.last_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                        {child.first_name} {child.last_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-bold flex items-center gap-1.5">
                        <span className="text-blue-600">{child.level?.name || '9ème année'}</span>
                        <span className="text-slate-300">•</span>
                        <span>{child.group?.name || 'Groupe A'}</span>
                      </p>
                    </div>
                  </div>

                  <Badge variant="emerald" className="text-[11px] font-black">
                    مسجل ونشط
                  </Badge>
                </div>

                {/* Metrics with Frost Widget Containers */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="frost-widget p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">نسبة المواظبة</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        {attRate}%
                      </span>
                      <span className="text-[11px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        ممتاز
                      </span>
                    </div>
                  </div>

                  <div className="frost-widget p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">اشتراك الشهر الحالي</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Badge variant={isPaid ? 'success' : 'warning'} className="text-[11px] font-black">
                        {isPaid ? 'خالص (80 د.ت)' : 'في الانتظار'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Latest Teacher Note */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    آخر ملاحظة وتوجيه من الأستاذ بسام
                  </span>
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 shadow-2xs">
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                      "{child.latestNote || 'تلميذ مواظب ومتفاعل بإيجابية في الدروس.'}"
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <Link href={`/parent/children/${child.id}`} className="block pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-2xl text-xs font-black justify-between h-10 border-blue-200/80 hover:border-blue-400 text-blue-700 hover:bg-blue-50/80 transition-all shadow-2xs"
                  >
                    <span>الاطلاع على التقرير الدراسي الشامل</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
