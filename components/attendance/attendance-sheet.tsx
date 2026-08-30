'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Users,
  Sparkles,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { batchUpsertAttendance } from '@/actions/sessions';
import { AttendanceStatus } from '@/types/database';
import { toast } from 'sonner';

interface AttendanceStudentItem {
  studentId: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus;
  note?: string;
}

export function AttendanceSheet({
  sessionId,
  sessionData,
}: {
  sessionId: string;
  sessionData: any;
}) {
  const group = sessionData?.group || {};
  const initialStudents: any[] = group?.students || [];

  const [items, setItems] = React.useState<AttendanceStudentItem[]>(() => {
    if (initialStudents.length > 0) {
      return initialStudents.map((s) => {
        const existing = sessionData.attendances?.find((a: any) => a.student_id === s.id);
        return {
          studentId: s.id,
          firstName: s.first_name,
          lastName: s.last_name,
          status: (existing?.status as AttendanceStatus) || 'PRESENT',
          note: existing?.note || '',
        };
      });
    }

    return [
      { studentId: 'ds1', firstName: 'Mohamed', lastName: 'Ben Ali', status: 'PRESENT' },
      { studentId: 'ds2', firstName: 'Sara', lastName: 'Trabelsi', status: 'PRESENT' },
      { studentId: 'ds3', firstName: 'Youssef', lastName: 'Ben Amor', status: 'LATE', note: 'Retard 10min' },
      { studentId: 'ds4', firstName: 'Nour', lastName: 'Mansouri', status: 'ABSENT' },
      { studentId: 'ds5', firstName: 'Karim', lastName: 'Jlassi', status: 'PRESENT' },
    ];
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item))
    );
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, note } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setItems((prev) => prev.map((item) => ({ ...item, status: 'PRESENT' })));
    toast.info('Tous les élèves marqués présents');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await batchUpsertAttendance(
        sessionId,
        items.map((i) => ({ studentId: i.studentId, status: i.status, note: i.note }))
      );
      toast.success("Feuille d'appel enregistrée !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = items.filter((i) => i.status === 'PRESENT').length;
  const absentCount = items.filter((i) => i.status === 'ABSENT').length;
  const lateCount = items.filter((i) => i.status === 'LATE').length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/sessions"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Retour au planning des séances
      </Link>

      {/* Header Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl shadow-xl shadow-blue-500/20 border-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Feuille d'appel • {group.name || 'Groupe'}
              </h1>
              <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
                {group.level?.name || 'Niveau'}
              </Badge>
            </div>
            <p className="text-xs text-blue-100 mt-1 flex items-center gap-3 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {sessionData.date || new Date().toISOString().split('T')[0]} ({sessionData.start_time || '16:00'} - {sessionData.end_time || '17:30'})
              </span>
              <span>•</span>
              <span>{sessionData.topic || 'Séance de cours'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="white"
              size="sm"
              onClick={handleMarkAllPresent}
              className="text-xs font-bold"
            >
              Tous présents
            </Button>
            <Button
              variant="white"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              className="rounded-xl font-bold shadow-md bg-blue-900/60 text-white border border-white/20 hover:bg-white/20"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Enregistrer l'appel
            </Button>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20 text-xs font-bold">
          <span className="bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-400/30 text-emerald-200">
            🟢 {presentCount} Présent{presentCount > 1 ? 's' : ''}
          </span>
          <span className="bg-red-500/20 px-2.5 py-1 rounded-lg border border-red-400/30 text-red-200">
            🔴 {absentCount} Absent{absentCount > 1 ? 's' : ''}
          </span>
          <span className="bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-400/30 text-amber-200">
            🟡 {lateCount} En retard
          </span>
        </div>
      </Card>

      {/* Attendance Roll Table */}
      <Card className="overflow-hidden shadow-md border-slate-200/80 dark:border-slate-800">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item, idx) => (
            <div
              key={item.studentId}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Student identity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 w-5">
                  {idx + 1}.
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shadow-2xs">
                  {item.firstName.charAt(0)}
                  {item.lastName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {item.firstName} {item.lastName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">Élève de Prof. Bassem</p>
                </div>
              </div>

              {/* Status buttons & note */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'PRESENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Présent
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'ABSENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.status === 'ABSENT'
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Absent
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'LATE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.status === 'LATE'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Retard
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'EXCUSED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.status === 'EXCUSED'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Excusé
                </button>

                <input
                  type="text"
                  placeholder="Remarque (ex: retard 15m)..."
                  value={item.note || ''}
                  onChange={(e) => handleNoteChange(item.studentId, e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
