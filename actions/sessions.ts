'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { AttendanceStatus } from '@/types/database';

export async function getSessions(limit = 20): Promise<any[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sessions')
      .select('*, group:groups(*), attendances(*)')
      .order('date', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getSessionById(id: string): Promise<any | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sessions')
      .select('*, group:groups(*, students(*)), attendances(*, student:students(*))')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createSession(formData: FormData): Promise<{ success?: boolean; session?: any; error?: string }> {
  const groupId = formData.get('groupId') as string;
  const date = formData.get('date') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const topic = formData.get('topic') as string;

  if (!groupId || !date || !startTime || !endTime) {
    return { error: 'Groupe, date, heure début et fin sont requis.' };
  }

  const supabase = await createClient();
  const { data, error } = await (supabase.from('sessions') as any)
    .insert({
      group_id: groupId,
      date,
      start_time: startTime,
      end_time: endTime,
      topic: topic || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const session: any = data;

  // Initialize attendance records for all students in group
  const { data: students } = await supabase
    .from('students')
    .select('id')
    .eq('group_id', groupId);

  if (students && students.length > 0) {
    const initialAttendances = (students as any[]).map((s) => ({
      session_id: session.id,
      student_id: s.id,
      status: 'PRESENT' as AttendanceStatus,
    }));
    await (supabase.from('attendances') as any).insert(initialAttendances);
  }

  revalidatePath('/sessions');
  revalidatePath('/dashboard');
  return { success: true, session };
}

export async function updateAttendance(attendanceId: string, status: AttendanceStatus, note?: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase.from('attendances') as any)
    .update({
      status,
      note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', attendanceId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function batchUpsertAttendance(sessionId: string, attendances: { studentId: string; status: AttendanceStatus; note?: string }[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  for (const item of attendances) {
    await (supabase.from('attendances') as any).upsert({
      session_id: sessionId,
      student_id: item.studentId,
      status: item.status,
      note: item.note || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'session_id,student_id' });
  }

  revalidatePath(`/sessions/${sessionId}/attendance`);
  revalidatePath('/dashboard');
  return { success: true };
}
