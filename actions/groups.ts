'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Group, Level } from '@/types/database';

export async function getLevels(): Promise<Level[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('levels').select('*').order('name');
    if (error || !data || data.length === 0) {
      return [
        { id: '1', name: '7ème année', description: 'Collège', created_at: '' },
        { id: '2', name: '8ème année', description: 'Collège', created_at: '' },
        { id: '3', name: '9ème année', description: 'Collège', created_at: '' },
        { id: '4', name: '1ère année Sec.', description: 'Lycée', created_at: '' },
        { id: '5', name: 'Baccalauréat', description: 'Lycée', created_at: '' },
      ];
    }
    return data as Level[];
  } catch {
    return [];
  }
}

export async function getGroups(): Promise<Group[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('groups')
      .select('*, level:levels(*), students(id)')
      .order('name');

    if (error || !data) return [];
    return data.map((g: any) => ({
      ...g,
      students_count: g.students ? g.students.length : 0,
    })) as Group[];
  } catch {
    return [];
  }
}

export async function getGroupById(id: string): Promise<any | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('groups')
      .select('*, level:levels(*), students(*), sessions(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createGroup(formData: FormData): Promise<{ success?: boolean; group?: any; error?: string }> {
  const name = formData.get('name') as string;
  const levelId = formData.get('levelId') as string;
  const monthlyFee = parseFloat((formData.get('monthlyFee') as string) || '80');

  if (!name || !levelId) {
    return { error: 'Nom et niveau sont obligatoires.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await (supabase.from('groups') as any).insert({
    name,
    level_id: levelId,
    monthly_fee: monthlyFee,
    teacher_id: user?.id,
  }).select().single();

  if (error) return { error: error.message };

  revalidatePath('/groups');
  revalidatePath('/dashboard');
  return { success: true, group: data };
}

export async function deleteGroup(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('groups').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/groups');
  return { success: true };
}
