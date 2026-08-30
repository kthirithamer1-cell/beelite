import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LandingView } from '@/components/landing/landing-view';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = user.user_metadata?.role || 'TEACHER';
    if (role === 'PARENT') {
      redirect('/parent/dashboard');
    } else {
      redirect('/dashboard');
    }
  }

  return <LandingView />;
}
