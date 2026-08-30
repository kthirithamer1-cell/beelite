'use client';

import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserRole } from '@/types/database';

export default function RegisterPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('+216 ');
  const [role, setRole] = React.useState<UserRole>('PARENT');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Veuillez renseigner tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
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
        toast.error(error.message);
        return;
      }

      toast.success('Compte créé avec succès ! Bienvenue sur Be Elite.');
      if (role === 'PARENT') {
        router.push('/parent/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-slate-200 backdrop-blur-md bg-white rounded-3xl overflow-hidden">
      <CardHeader className="text-center pt-8 pb-4 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mx-auto mb-3 animate-pulse-glow">
          <GraduationCap className="w-7 h-7" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
          Créer un compte • Be <span className="text-blue-600">Elite</span>
        </CardTitle>
        <CardDescription className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 mt-0.5">
          Rejoignez l'espace de suivi de Professeur Bassem
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Type de profil *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('PARENT')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  role === 'PARENT'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👨‍👩‍👦 Parent d'élève
              </button>
              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  role === 'TEACHER'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🎓 Professeur Bassem
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Nom complet *"
                type="text"
                placeholder="ex: Ahmed Ben Ali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 rounded-xl focus:ring-blue-500 font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Adresse Email *"
                type="email"
                placeholder="votre.email@beelite.com"
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
                label="Numéro de téléphone (+216)"
                type="tel"
                placeholder="+216 98 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 rounded-xl focus:ring-blue-500 font-medium"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                label="Mot de passe (min 6 caractères) *"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 rounded-xl focus:ring-blue-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-8" />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 cursor-pointer" isLoading={isLoading}>
            <span>Créer mon accès</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6 text-xs text-slate-500">
        Déjà inscrit ?{' '}
        <Link
          href="/login"
          className="text-blue-600 font-bold ml-1 hover:underline"
        >
          Se connecter
        </Link>
      </CardFooter>
    </Card>
  );
}
