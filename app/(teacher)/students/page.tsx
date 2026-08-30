import { getStudents } from '@/actions/students';
import { getLevels, getGroups } from '@/actions/groups';
import { StudentManager } from '@/components/students/student-manager';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  const [students, levels, groups] = await Promise.all([
    getStudents(),
    getLevels(),
    getGroups(),
  ]);

  return <StudentManager initialStudents={students} levels={levels} groups={groups} />;
}
