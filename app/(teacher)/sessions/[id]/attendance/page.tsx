import { getSessionById } from '@/actions/sessions';
import { AttendanceSheet } from '@/components/attendance/attendance-sheet';

export const dynamic = 'force-dynamic';

export default async function SessionAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let session = await getSessionById(id);

  if (!session) {
    session = {
      id,
      date: new Date().toISOString().split('T')[0],
      start_time: '16:00',
      end_time: '17:30',
      topic: 'Séance de cours',
      group: {
        id: 'g1',
        name: 'Groupe 9ème A',
        level: { name: '9ème année' },
        students: [
          { id: 'ds1', first_name: 'Mohamed', last_name: 'Ben Ali' },
          { id: 'ds2', first_name: 'Sara', last_name: 'Trabelsi' },
          { id: 'ds3', first_name: 'Youssef', last_name: 'Ben Amor' },
          { id: 'ds4', first_name: 'Nour', last_name: 'Mansouri' },
        ],
      },
      attendances: [],
    };
  }

  return <AttendanceSheet sessionId={id} sessionData={session} />;
}
