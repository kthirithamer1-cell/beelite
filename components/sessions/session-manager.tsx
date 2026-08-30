'use client';

import * as React from 'react';
import { Group } from '@/types/database';
import { SessionsCalendar } from '@/components/sessions/sessions-calendar';

export function SessionManager({
  initialSessions,
  groups,
}: {
  initialSessions: any[];
  groups: Group[];
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SessionsCalendar initialSessions={initialSessions} groups={groups} />
    </div>
  );
}
