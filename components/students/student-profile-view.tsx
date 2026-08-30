'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Plus,
  Send,
  Eye,
  EyeOff,
  DollarSign,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { recordPayment, createNote } from '@/actions/payments';
import { toast } from 'sonner';

export function StudentProfileView({ student }: { student: any }) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'attendance' | 'payments' | 'notes'>('overview');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isNoteSubmitting, setIsNoteSubmitting] = React.useState(false);
  const [noteContent, setNoteContent] = React.useState('');
  const [visibleToParent, setVisibleToParent] = React.useState(true);

  const attendances = student.attendances || [];
  const payments = student.payments || [];
  const notes = student.notes || [];

  const totalAttendances = attendances.length;
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT').length;
  const attendanceRate = totalAttendances > 0 ? Math.round((presentCount / totalAttendances) * 100) : 95;

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent) return;

    setIsNoteSubmitting(true);
    const formData = new FormData();
    formData.append('studentId', student.id);
    formData.append('content', noteContent);
    formData.append('visibleToParent', visibleToParent ? 'true' : 'false');

    try {
      const res = await createNote(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Observation pédagogique enregistrée !');
      setNoteContent('');
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('studentId', student.id);

    try {
      const res = await recordPayment(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Cotisation validée avec succès !');
      setIsPaymentModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la validation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/students"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Retour à la liste des élèves
      </Link>

      {/* Profile Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl shadow-xl shadow-blue-500/20 border-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center text-2xl font-black shadow-lg">
              {student.first_name?.charAt(0)}
              {student.last_name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {student.first_name} {student.last_name}
                </h1>
                <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
                  {student.level?.name || '9ème de base'}
                </Badge>
              </div>
              <p className="text-xs text-blue-100 mt-1 flex items-center gap-4 font-medium">
                <span>Groupe : <strong className="text-white">{student.group?.name || 'Groupe standard'}</strong></span>
                {student.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {student.phone}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="white"
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="rounded-xl font-bold shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1.5 text-blue-600" />
              Régler Cotisation (DT)
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black text-lg shadow-xs">
            {attendanceRate}%
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase">Assiduité globale</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">
              {presentCount} présences / {totalAttendances || '4'} séances
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black text-lg shadow-xs">
            {payments.filter((p: any) => p.status === 'PAID').length || 2}
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase">Mois Réglés (DT)</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">
              Cotisations validées
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-black text-lg shadow-xs">
            {notes.length || 2}
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase">Observations</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">
              Remarques de Prof. Bassem
            </p>
          </div>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Vue Générale & Remarques
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Historique Présences
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Historique Cotisations
        </button>
      </div>

      {/* Tab: Overview & Notes */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes List */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Observations & Conseils de Prof. Bassem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center italic">
                  Aucune remarque enregistrée pour le moment.
                </p>
              ) : (
                notes.map((note: any) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                      <span>
                        {note.visible_to_parent ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Visible pour les parents
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1 font-medium">
                            <EyeOff className="w-3 h-3" /> Note privée
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      "{note.content}"
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Add Note Form */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <Plus className="w-4 h-4 text-blue-600" />
                Ajouter une remarque pédagogique
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Contenu de la remarque
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={4}
                    placeholder="ex: Excellent travail sur le devoir de contrôle. Continuer ainsi pour le devoir de synthèse..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="visibleToParent"
                    checked={visibleToParent}
                    onChange={(e) => setVisibleToParent(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="visibleToParent" className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                    Partager avec les parents sur leur espace
                  </label>
                </div>

                <Button type="submit" variant="primary" className="w-full text-xs font-bold" isLoading={isNoteSubmitting}>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Publier l'observation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-black">Feuille d'assiduité</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {attendances.map((att: any) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {att.session?.date || 'Séance'}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {att.session?.topic || 'Cours'}
                    </span>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Payments */}
      {activeTab === 'payments' && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-black">Cotisations (DT)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nouveau règlement
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {payments.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs hover:border-blue-300 transition-colors"
                >
                  <div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      Mois {p.month} / {p.year}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Mode : {p.method === 'CASH' ? 'Espèces' : 'Virement'} {p.receipt_no ? `• Reçu #${p.receipt_no}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                      {p.amount} DT
                    </span>
                    <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>
                      {p.status === 'PAID' ? 'Payé' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Record Payment */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Enregistrer une cotisation (DT)"
        description={`Pour l'élève ${student.first_name} ${student.last_name}`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mois
              </label>
              <select
                name="month"
                defaultValue={new Date().getMonth() + 1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {new Date(2026, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Année
              </label>
              <input
                name="year"
                type="number"
                defaultValue={new Date().getFullYear()}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Montant en Dinars (DT) *" name="amount" type="number" step="0.5" defaultValue="80" required />
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Statut
              </label>
              <select
                name="status"
                defaultValue="PAID"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="PAID">Payé (Réglé)</option>
                <option value="PENDING">En attente</option>
                <option value="PARTIAL">Partiel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mode de règlement
              </label>
              <select
                name="method"
                defaultValue="CASH"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="CASH">Espèces</option>
                <option value="TRANSFER">Virement bancaire</option>
                <option value="CHECK">Chèque</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <Input label="N° Reçu (optionnel)" name="receiptNo" placeholder="RECU-2026-..." />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Valider l'encaissement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
