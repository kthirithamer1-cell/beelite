'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Users,
  Calendar,
  CreditCard,
  Trash2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { createGroup, deleteGroup } from '@/actions/groups';
import { Group, Level } from '@/types/database';
import { toast } from 'sonner';

export function GroupManager({
  initialGroups,
  levels,
}: {
  initialGroups: Group[];
  levels: Level[];
}) {
  const [groups, setGroups] = React.useState<Group[]>(initialGroups);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (initialGroups.length > 0) {
      setGroups(initialGroups);
    } else {
      // Tunisian Demo Groups
      setGroups([
        {
          id: 'g1',
          name: 'Groupe 9ème de base A',
          monthly_fee: 80,
          teacher_id: '',
          level_id: 'l1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: 'l1', name: '9ème de base (Brevet)', created_at: '' },
          students_count: 8,
        },
        {
          id: 'g2',
          name: 'Bac Sciences & Maths',
          monthly_fee: 100,
          teacher_id: '',
          level_id: 'l2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: 'l2', name: 'Baccalauréat', created_at: '' },
          students_count: 12,
        },
        {
          id: 'g3',
          name: 'Bac Économie & Gestion',
          monthly_fee: 90,
          teacher_id: '',
          level_id: 'l3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: 'l3', name: 'Baccalauréat', created_at: '' },
          students_count: 7,
        },
      ]);
    }
  }, [initialGroups]);

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await createGroup(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Groupe créé avec succès !');
      setIsModalOpen(false);
      if (res.group) {
        setGroups((prev) => [res.group as any, ...prev]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le groupe ${name} ?`)) return;
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Groupe supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Groupes & Classes • Prof. Bassem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organisation des cours particuliers par niveau (Collège & Lycée de Tunisie).
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl shadow-lg shadow-blue-500/25 font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nouveau groupe
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all border-slate-200/80 dark:border-slate-800"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <Badge variant="blue" className="text-[11px] font-bold">
                  {group.level?.name || 'Niveau'}
                </Badge>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">
                {group.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tarif mensuel élève : <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{group.monthly_fee || 80} DT</strong>
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Users className="w-4 h-4 text-blue-600" />
                  {group.students_count || 0} élève{(group.students_count || 0) > 1 ? 's' : ''} inscrits
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  ● Actif
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(group.id, group.name)}
                className="text-xs text-slate-400 hover:text-red-600 px-2 h-8"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Supprimer
              </Button>

              <Link href={`/sessions`}>
                <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500 group-hover:text-white" />
                  Planifier séance
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Create Group */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un groupe de cours"
        description="Associez le groupe à un niveau scolaire et définissez le tarif mensuel en Dinars Tunisiens (DT)."
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <Input
            label="Nom du groupe *"
            name="name"
            placeholder="ex: Groupe 9ème A, Bac Sciences B..."
            required
          />

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Niveau scolaire (Tunisie) *
            </label>
            <select
              name="levelId"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Tarif mensuel par élève (DT) *"
            name="monthlyFee"
            type="number"
            defaultValue="80"
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Créer le groupe
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
