'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Student } from '@/types/database';

export async function getStudents(): Promise<Student[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*, level:levels(*), group:groups(*)')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch students warning:', error?.message);
      return [];
    }
    return data as Student[];
  } catch (err) {
    console.error('Error fetching students:', err);
    return [];
  }
}

export async function getStudentById(id: string): Promise<any | null> {
  try {
    const supabase = await createClient();
    const { data: student, error } = await supabase
      .from('students')
      .select('*, level:levels(*), group:groups(*), attendances(*), payments(*), notes(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    return student;
  } catch (err) {
    return null;
  }
}

export async function createStudent(formData: FormData): Promise<{ success?: boolean; student?: any; error?: string }> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const levelId = formData.get('levelId') as string;
  const groupId = formData.get('groupId') as string;

  if (!firstName || !lastName || !levelId) {
    return { error: 'Prénom, nom et niveau sont requis.' };
  }

  const supabase = await createClient();
  const { data, error } = await (supabase.from('students') as any).insert({
    first_name: firstName,
    last_name: lastName,
    phone: phone || null,
    email: email || null,
    level_id: levelId,
    group_id: groupId || null,
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/students');
  revalidatePath('/dashboard');
  return { success: true, student: data };
}

export async function updateStudent(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const levelId = formData.get('levelId') as string;
  const groupId = formData.get('groupId') as string;

  const supabase = await createClient();
  const { error } = await (supabase.from('students') as any)
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      email: email || null,
      level_id: levelId,
      group_id: groupId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/students');
  revalidatePath(`/students/${id}`);
  return { success: true };
}

export async function deleteStudent(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('students').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/students');
  revalidatePath('/dashboard');
  return { success: true };
}
