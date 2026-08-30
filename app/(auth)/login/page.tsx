'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Users,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = React.useState('bassem@beelite.com');
  const [password, setPassword] = React.useState('bassem123456');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setUnverifiedEmail(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      // 1. Try Signing In
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 2. If user doesn't exist yet, auto-provision via signUp
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('not found') || error.message.includes('User not found'))) {
        const isParent = email.includes('parent');
        const signUpRes = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: isParent ? 'Ahmed Ben Ali (Parent)' : 'Professeur Bassem',
              role: isParent ? 'PARENT' : 'TEACHER',
              phone: isParent ? '+216 55 987 654' : '+216 98 123 456',
            },
          },
        });

        if (!signUpRes.error && signUpRes.data.user) {
          // Re-attempt sign in
          const retrySignIn = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          data = retrySignIn.data;
          error = retrySignIn.error;
        }
      }

      if (error) {
        const errMsg = error.message.toLowerCase();
        if (errMsg.includes('email not confirmed') || errMsg.includes('not confirmed') || errMsg.includes('not verified')) {
          setUnverifiedEmail(email);
          toast.error('Ce compte parent n\'a pas encore été vérifié par email.');
          return;
        }
        toast.error(error.message || 'Identifiants invalides');
        return;
      }

      toast.success('Connexion réussie ! Bienvenue sur Be Elite.');
      const role = data.user?.user_metadata?.role || (email.includes('parent') ? 'PARENT' : 'TEACHER');
      
      if (role === 'PARENT') {
        router.push('/parent/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unverifiedEmail,
      });

      if (error) {
        toast.error(error.message || 'Impossible d\'envoyer l\'email');
      } else {
        toast.success('Lien de vérification renvoyé avec succès ! Vérifiez votre boîte de réception.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsResending(false);
    }
  };

  const handleQuickFill = async (role: 'TEACHER' | 'PARENT') => {
    setUnverifiedEmail(null);
    if (role === 'TEACHER') {
      setEmail('bassem@beelite.com');
      setPassword('bassem123456');
    } else {
      setEmail('parent@beelite.com');
      setPassword('parent123456');
    }
    toast.info(`Identifiants ${role === 'TEACHER' ? 'Prof. Bassem' : 'Parent'} pré-remplis`);
  };

  return (
    <Card className="shadow-2xl border-slate-200 backdrop-blur-md bg-white rounded-3xl overflow-hidden">
      <CardHeader className="text-center pt-8 pb-4 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mx-auto mb-3 animate-pulse-glow">
          <GraduationCap className="w-7 h-7" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
          Be <span className="text-blue-600">Elite</span>
        </CardTitle>
        <CardDescription className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          Espace de Professeur Bassem • تونس 🇹🇳
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Unverified Account Banner */}
        {unverifiedEmail && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-amber-900">
                  Compte en attente de vérification email
                </p>
                <p className="text-amber-700 mt-0.5 leading-relaxed font-medium">
                  Le compte <span className="font-bold font-mono">{unverifiedEmail}</span> n'a pas encore validé son adresse email.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendConfirmation}
                isLoading={isResending}
                className="w-full sm:w-auto text-[11px] font-black h-8 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                <Send className="w-3 h-3 mr-1" />
                Renvoyer le lien de confirmation
              </Button>
              <span className="text-[10px] text-amber-600 font-semibold">
                Ou valider depuis Supabase Dashboard
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Adresse Email"
                type="email"
                placeholder="bassem@beelite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 rounded-xl focus:ring-blue-500 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 rounded-xl focus:ring-blue-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-8" />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 cursor-pointer" isLoading={isLoading}>
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Quick Demo Pre-fills */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center mb-3">
            Accès Démo Rapide (1-Clic)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('TEACHER')}
              className="text-xs rounded-xl font-bold border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Prof. Bassem
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('PARENT')}
              className="text-xs rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Espace Parent
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-center pb-6 text-xs text-slate-500">
        Nouveau compte ?{' '}
        <Link
          href="/register"
          className="text-blue-600 font-bold ml-1 hover:underline"
        >
          Créer un accès
        </Link>
      </CardFooter>
    </Card>
  );
}
