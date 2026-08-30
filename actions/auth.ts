'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Veuillez saisir votre email et mot de passe.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message || 'Identifiants invalides.' };
  }

  const role = data.user?.user_metadata?.role || 'TEACHER';
  if (role === 'PARENT') {
    redirect('/parent/dashboard');
  } else {
    redirect('/dashboard');
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'TEACHER';
  const phone = formData.get('phone') as string;

  if (!name || !email || !password) {
    return { error: 'Tous les champs obligatoires doivent être renseignés.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (role === 'PARENT') {
    redirect('/parent/dashboard');
  } else {
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
