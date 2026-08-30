import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes check
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isTeacherRoute = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/students') || 
                         pathname.startsWith('/groups') || 
                         pathname.startsWith('/sessions') || 
                         pathname.startsWith('/payments');
  const isParentRoute = pathname.startsWith('/parent');

  if (!user && (isTeacherRoute || isParentRoute)) {
    // Redirect unauthenticated user to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    // If already logged in, redirect according to role
    const role = user.user_metadata?.role || 'TEACHER';
    const redirectPath = role === 'PARENT' ? '/parent/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role-based access control
  if (user) {
    const role = user.user_metadata?.role || 'TEACHER';
    if (isTeacherRoute && role === 'PARENT') {
      return NextResponse.redirect(new URL('/parent/dashboard', request.url));
    }
    if (isParentRoute && role === 'TEACHER') {
      // Allow teachers to view parent view or stay on dashboard
    }
  }

  return supabaseResponse;
}
