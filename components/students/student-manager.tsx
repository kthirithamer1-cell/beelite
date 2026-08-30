'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Filter,
  User,
  Phone,
  Layers,
  ChevronRight,
  CheckCircle2,
  Trash2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { createStudent, deleteStudent } from '@/actions/students';
import { Student, Level, Group } from '@/types/database';
import { toast } from 'sonner';

interface StudentManagerProps {
  initialStudents: Student[];
  levels: Level[];
  groups: Group[];
}

export function StudentManager({
  initialStudents,
  levels,
  groups,
}: StudentManagerProps) {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = React.useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(initialStudents);
    } else {
      // Tunisian Demo Students
      setStudents([
        {
          id: 'demo-s1',
          first_name: 'Mohamed',
          last_name: 'Ben Ali',
          phone: '+216 98 765 432',
          email: 'mohamed.ba@example.tn',
          active: true,
          enrollment_date: '2026-09-01',
          level_id: levels[0]?.id || '1',
          group_id: groups[0]?.id || 'g1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: '1', name: '9ème de base', created_at: '' },
          group: { id: 'g1', name: 'Groupe 9ème A', teacher_id: '', level_id: '1', created_at: '', updated_at: '' },
        },
        {
          id: 'demo-s2',
          first_name: 'Sara',
          last_name: 'Trabelsi',
          phone: '+216 55 123 987',
          email: 'sara.tr@example.tn',
          active: true,
          enrollment_date: '2026-09-05',
          level_id: levels[1]?.id || '2',
          group_id: groups[1]?.id || 'g2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: '2', name: 'Bac Sciences', created_at: '' },
          group: { id: 'g2', name: 'Bac Sciences & Maths', teacher_id: '', level_id: '2', created_at: '', updated_at: '' },
        },
        {
          id: 'demo-s3',
          first_name: 'Ahmed',
          last_name: 'Gharbi',
          phone: '+216 22 456 789',
          email: 'ahmed.gh@example.tn',
          active: true,
          enrollment_date: '2026-09-10',
          level_id: levels[2]?.id || '3',
          group_id: groups[2]?.id || 'g3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: '3', name: 'Bac Économie', created_at: '' },
          group: { id: 'g3', name: 'Bac Éco & Gestion', teacher_id: '', level_id: '3', created_at: '', updated_at: '' },
        },
        {
          id: 'demo-s4',
          first_name: 'Youssef',
          last_name: 'Ben Amor',
          phone: '+216 29 888 777',
          email: 'youssef.ba@example.tn',
          active: true,
          enrollment_date: '2026-09-12',
          level_id: levels[0]?.id || '1',
          group_id: groups[0]?.id || 'g1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: { id: '1', name: '9ème de base', created_at: '' },
          group: { id: 'g1', name: 'Groupe 9ème A', teacher_id: '', level_id: '1', created_at: '', updated_at: '' },
        },
      ]);
    }
  }, [initialStudents, levels, groups]);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = selectedLevel === 'ALL' || s.level_id === selectedLevel;
    const matchesGroup = selectedGroup === 'ALL' || s.group_id === selectedGroup;

    return matchesSearch && matchesLevel && matchesGroup;
  });

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await createStudent(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Élève inscrit avec succès !');
      setIsAddModalOpen(false);
      if (res.student) {
        setStudents((prev) => [res.student as any, ...prev]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression de ${name} ?`)) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success('Élève supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mes Élèves • Prof. Bassem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''} suivi{filteredStudents.length > 1 ? 's' : ''} dans vos groupes.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl shadow-lg shadow-blue-500/25 font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter un élève
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone (+216)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">Tous les niveaux (Collège & Lycée)</option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">Tous les groupes</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const groupName = student.group?.name || 'Sans groupe';
          const levelName = student.level?.name || 'Niveau standard';

          return (
            <Card
              key={student.id}
              className="p-5 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all group border-slate-200/80 dark:border-slate-800"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                      {student.first_name.charAt(0)}
                      {student.last_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 transition-colors">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Inscrit le {new Date(student.enrollment_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <Badge variant="blue" className="text-[10px]">
                    {levelName}
                  </Badge>
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {groupName}
                    </span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)}
                  className="text-xs text-slate-400 hover:text-red-600 px-2 h-8"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Supprimer
                </Button>

                <Link href={`/students/${student.id}`}>
                  <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <span>Fiche & Suivi</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un élève"
        description="Enregistrez les informations de l'élève pour le suivi de Professeur Bassem."
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom *" name="firstName" placeholder="ex: Mohamed" required />
            <Input label="Nom *" name="lastName" placeholder="ex: Ben Ali" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone (+216)" name="phone" placeholder="+216 98 123 456" />
            <Input label="Email (optionnel)" name="email" type="email" placeholder="eleve@email.tn" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Niveau scolaire *
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

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Groupe / Classe de Prof. Bassem
            </label>
            <select
              name="groupId"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="">-- Sans groupe (en attente) --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.level?.name || 'Niveau'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Enregistrer l'élève
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
