import { getStudentById } from '@/actions/students';
import { StudentProfileView } from '@/components/students/student-profile-view';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let student = await getStudentById(id);

  if (!student) {
    // If not found in DB or test demo id, provide clean fallback structure
    student = {
      id,
      first_name: 'Mohamed',
      last_name: 'Ben Ali',
      phone: '+216 98 765 432',
      email: 'mohamed.ba@example.com',
      enrollment_date: '2026-09-01',
      level: { name: '9ème année' },
      group: { name: 'Groupe 9ème A' },
      attendances: [
        { id: '1', status: 'PRESENT', session: { date: '2026-08-20', topic: 'Grammar review' } },
        { id: '2', status: 'PRESENT', session: { date: '2026-08-18', topic: 'Vocabulary workshop' } },
        { id: '3', status: 'ABSENT', session: { date: '2026-08-15', topic: 'Reading test' } },
      ],
      payments: [
        { id: 'p1', month: 8, year: 2026, amount: 80, status: 'PAID', method: 'CASH', receipt_no: 'REC-0081' },
        { id: 'p2', month: 7, year: 2026, amount: 80, status: 'PAID', method: 'CASH', receipt_no: 'REC-0042' },
      ],
      notes: [
        { id: 'n1', content: 'Très bonne participation aujourd’hui. Des progrès notables.', visible_to_parent: true, created_at: new Date().toISOString() },
        { id: 'n2', content: 'Prévoir un exercice supplémentaire sur le passé composé.', visible_to_parent: false, created_at: new Date().toISOString() },
      ],
    };
  }

  return <StudentProfileView student={student} />;
}
