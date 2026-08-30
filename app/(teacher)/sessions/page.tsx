import { getSessions } from '@/actions/sessions';
import { getGroups } from '@/actions/groups';
import { SessionManager } from '@/components/sessions/session-manager';

export const dynamic = 'force-dynamic';

export default async function SessionsPage() {
  const [sessions, groups] = await Promise.all([
    getSessions(50),
    getGroups(),
  ]);

  return <SessionManager initialSessions={sessions} groups={groups} />;
}
