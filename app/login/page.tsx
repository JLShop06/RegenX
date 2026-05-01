'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message
      );
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-black">R</span>
          </div>
          <h1 className="text-3xl font-black text-white">RegenX</h1>
          <p className="text-slate-400 mt-1">Ton coach IA fitness & nutrition</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Bon retour !</h2>
          <p className="text-slate-400 text-sm mb-6">Connecte-toi pour accéder à ton programme.</p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="toi@exemple.com"
                {...register('email')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed 
                text-white font-semibold rounded-lg transition-all duration-200 mt-2 shadow-lg shadow-emerald-900/30"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          En continuant, tu acceptes nos{' '}
          <Link href="/terms" className="underline hover:text-slate-400 transition">CGU</Link>{' '}
          et notre{' '}
          <Link href="/privacy" className="underline hover:text-slate-400 transition">politique de confidentialité</Link>.
        </p>
      </div>
    </main>
  );
}
