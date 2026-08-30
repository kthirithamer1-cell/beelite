'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PaymentStatus, PaymentMethod } from '@/types/database';

export async function getPayments(month?: number, year?: number): Promise<any[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('payments')
      .select('*, student:students(*, level:levels(*), group:groups(*))')
      .order('created_at', { ascending: false });

    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', year);

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function recordPayment(formData: FormData): Promise<{ success?: boolean; payment?: any; error?: string }> {
  const studentId = formData.get('studentId') as string;
  const month = parseInt(formData.get('month') as string, 10);
  const year = parseInt(formData.get('year') as string, 10);
  const amount = parseFloat(formData.get('amount') as string);
  const status = (formData.get('status') as PaymentStatus) || 'PAID';
  const method = (formData.get('method') as PaymentMethod) || 'CASH';
  const notes = formData.get('notes') as string;
  const receiptNo = formData.get('receiptNo') as string;

  if (!studentId || !month || !year || isNaN(amount)) {
    return { error: 'Élève, mois, année et montant sont obligatoires.' };
  }

  const supabase = await createClient();
  const { data, error } = await (supabase.from('payments') as any).upsert({
    student_id: studentId,
    month,
    year,
    amount,
    status,
    method,
    paid_at: status === 'PAID' ? new Date().toISOString() : null,
    notes: notes || null,
    receipt_no: receiptNo || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'student_id,month,year' }).select().single();

  if (error) return { error: error.message };

  revalidatePath('/payments');
  revalidatePath('/dashboard');
  revalidatePath(`/students/${studentId}`);
  return { success: true, payment: data };
}

export async function createNote(formData: FormData): Promise<{ success?: boolean; note?: any; error?: string }> {
  const studentId = formData.get('studentId') as string;
  const sessionId = formData.get('sessionId') as string;
  const content = formData.get('content') as string;
  const visibleToParent = formData.get('visibleToParent') === 'true';

  if (!studentId || !content) {
    return { error: 'Élève et contenu sont requis.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await (supabase.from('notes') as any).insert({
    student_id: studentId,
    session_id: sessionId || null,
    teacher_id: user?.id,
    content,
    visible_to_parent: visibleToParent,
  }).select().single();

  if (error) return { error: error.message };

  revalidatePath(`/students/${studentId}`);
  return { success: true, note: data };
}
