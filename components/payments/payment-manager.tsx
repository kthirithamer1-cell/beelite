'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Receipt,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { recordPayment } from '@/actions/payments';
import { Student, PaymentStatus } from '@/types/database';
import { toast } from 'sonner';

export function PaymentManager({
  initialStudents,
  initialPayments,
}: {
  initialStudents: Student[];
  initialPayments: any[];
}) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = React.useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = React.useState<number>(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  const students = initialStudents.length > 0 ? initialStudents : [
    {
      id: 'ds1',
      first_name: 'Mohamed',
      last_name: 'Ben Ali',
      level: { name: '9ème de base' },
      group: { name: 'Groupe 9ème A', monthly_fee: 80 },
    },
    {
      id: 'ds2',
      first_name: 'Sara',
      last_name: 'Trabelsi',
      level: { name: 'Bac Sciences' },
      group: { name: 'Bac Sciences & Maths', monthly_fee: 100 },
    },
    {
      id: 'ds3',
      first_name: 'Ahmed',
      last_name: 'Gharbi',
      level: { name: 'Bac Économie' },
      group: { name: 'Bac Éco & Gestion', monthly_fee: 90 },
    },
    {
      id: 'ds4',
      first_name: 'Youssef',
      last_name: 'Ben Amor',
      level: { name: '9ème de base' },
      group: { name: 'Groupe 9ème A', monthly_fee: 80 },
    },
  ];

  const paymentRows = students.map((student: any) => {
    const payment = initialPayments.find(
      (p) => p.student_id === student.id && p.month === selectedMonth && p.year === selectedYear
    );
    return {
      student,
      payment: payment || {
        status: (student.id === 'ds1' || student.id === 'ds3' ? 'PAID' : 'PENDING') as PaymentStatus,
        amount: student.group?.monthly_fee || 80,
        paid_at: student.id === 'ds1' || student.id === 'ds3' ? '2026-08-05' : null,
      },
    };
  });

  const filteredRows = paymentRows.filter(({ student, payment }) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuickPay = async (student: any, amount: number) => {
    const formData = new FormData();
    formData.append('studentId', student.id);
    formData.append('month', selectedMonth.toString());
    formData.append('year', selectedYear.toString());
    formData.append('amount', amount.toString());
    formData.append('status', 'PAID');
    formData.append('method', 'CASH');

    try {
      await recordPayment(formData);
      toast.success(`Cotisation de ${student.first_name} ${student.last_name} validée !`);
    } catch (err: any) {
      toast.error('Erreur lors de la validation');
    }
  };

  const totalCollected = filteredRows
    .filter((r) => r.payment.status === 'PAID')
    .reduce((sum, r) => sum + (r.payment.amount || 80), 0);

  const totalPending = filteredRows
    .filter((r) => r.payment.status === 'PENDING')
    .reduce((sum, r) => sum + (r.payment.amount || 80), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Cotisations & Paiements (DT)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi des règlements mensuels pour les cours de Professeur Bassem.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 shadow-2xs"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>
                {new Date(2026, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 shadow-2xs"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase">
                Total Encaissé (DT)
              </p>
              <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {totalCollected} DT
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase">
                Cotisations en attente (DT)
              </p>
              <h3 className="text-3xl font-black text-amber-900 dark:text-amber-200 mt-1">
                {totalPending} DT
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-sm border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase">Taux de règlement</p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {filteredRows.length > 0
                  ? Math.round(
                      (filteredRows.filter((r) => r.payment.status === 'PAID').length /
                        filteredRows.length) *
                        100
                    )
                  : 0}
                %
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'PAID'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Réglés
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              En attente
            </button>
          </div>
        </div>
      </Card>

      {/* Payment Rows Table */}
      <Card className="overflow-hidden shadow-md border-slate-200/80 dark:border-slate-800">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredRows.map(({ student, payment }) => {
            const isPaid = payment.status === 'PAID';
            return (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shadow-2xs">
                    {student.first_name.charAt(0)}
                    {student.last_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {student.first_name} {student.last_name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {student.group?.name || 'Sans groupe'} • {student.level?.name || 'Niveau'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {payment.amount || 80} DT
                    </span>
                    <Badge variant={isPaid ? 'success' : 'warning'} className="text-[10px]">
                      {isPaid ? 'Réglé' : 'En attente'}
                    </Badge>
                  </div>

                  {!isPaid ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickPay(student, payment.amount || 80)}
                      className="text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Valider encaissement
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Payé
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
