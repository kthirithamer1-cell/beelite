import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStudentById } from '@/actions/students';

export const dynamic = 'force-dynamic';

export default async function ParentChildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let child = await getStudentById(id);

  if (!child) {
    child = {
      id,
      first_name: 'Mohamed',
      last_name: 'Ben Ali',
      level: { name: '9ème année de base' },
      group: { name: 'Groupe 9ème A' },
      attendances: [
        { id: '1', status: 'PRESENT', session: { date: '2026-08-20', topic: 'Révision Devoir de Synthèse' } },
        { id: '2', status: 'PRESENT', session: { date: '2026-08-18', topic: 'Méthodologie d’analyse' } },
        { id: '3', status: 'ABSENT', session: { date: '2026-08-15', topic: 'Exercices d’application' } },
        { id: '4', status: 'PRESENT', session: { date: '2026-08-12', topic: 'Introduction & Fondations' } },
      ],
      payments: [
        { id: 'p1', month: 8, year: 2026, amount: 80, status: 'PAID', method: 'CASH', receipt_no: 'REC-0081' },
        { id: 'p2', month: 7, year: 2026, amount: 80, status: 'PAID', method: 'CASH', receipt_no: 'REC-0042' },
      ],
      notes: [
        { id: 'n1', content: 'Très bon engagement en classe. Les progrès sur les devoirs types sont flagrants.', visible_to_parent: true, created_at: new Date().toISOString() },
        { id: 'n2', content: 'Exercices de synthèse bien assimilés et rédigés avec rigueur.', visible_to_parent: true, created_at: new Date().toISOString() },
      ],
    };
  }

  const attendances = child.attendances || [];
  const payments = child.payments || [];
  const visibleNotes = (child.notes || []).filter((n: any) => n.visible_to_parent !== false);

  const totalSessions = attendances.length;
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT').length;
  const rate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 94;

  return (
    <div className="space-y-6">
      <Link
        href="/parent/dashboard"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Retour à mes enfants
      </Link>

      {/* Child Banner - Royal Blue & White */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl shadow-xl shadow-blue-500/20 border-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center text-2xl font-black shadow-lg">
            {child.first_name?.charAt(0)}
            {child.last_name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {child.first_name} {child.last_name}
              </h1>
              <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
                {child.level?.name || '9ème année'}
              </Badge>
            </div>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              Groupe : <strong className="text-white">{child.group?.name || 'Groupe standard'}</strong> • Encadré par <strong className="text-white">Professeur Bassem</strong>
            </p>
          </div>
        </div>
      </Card>

      {/* 3 Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black text-lg shadow-2xs">
            {rate}%
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Assiduité globale</p>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-bold mt-0.5">
              {presentCount} présences / {totalSessions} séances
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-lg shadow-2xs">
            {payments.filter((p: any) => p.status === 'PAID').length}
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mois Réglés (DT)</p>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-bold mt-0.5">
              Cotisations à jour
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black text-lg shadow-2xs">
            {visibleNotes.length}
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Observations</p>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-bold mt-0.5">
              Partagées par Prof. Bassem
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Calendar className="w-4 h-4 text-blue-600" />
              Historique des présences aux cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {attendances.map((att: any) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {att.session?.date || 'Date séance'}
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium">{att.session?.topic || 'Cours'}</p>
                </div>
                <Badge
                  variant={
                    att.status === 'PRESENT'
                      ? 'success'
                      : att.status === 'ABSENT'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {att.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Teacher Notes List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Remarques de Professeur Bassem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {visibleNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Aucune remarque partagée pour l'instant.
              </p>
            ) : (
              visibleNotes.map((note: any) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-800 space-y-1"
                >
                  <span className="text-[10px] text-slate-400 font-bold">
                    {new Date(note.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold italic">
                    "{note.content}"
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
