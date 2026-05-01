'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
  gdpr: z.boolean().refine((val) => val === true, {
    message: "Tu dois accepter les conditions d'utilisation",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { gdpr: false },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          marketing_emails: false,
        },
      },
    });

    if (error) {
      setServerError(
        error.message === 'User already registered'
          ? 'Un compte existe déjà avec cet email.'
          : error.message
      );
      return;
    }

    // Envoyer l'email de bienvenue (non bloquant)
    try {
      await fetch('/api/auth/welcome', { method: 'POST' });
    } catch {
      // Silently ignore - welcome email is non-critical
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Vérifie ta boîte mail !</h2>
          <p className="text-slate-400 mb-6">
            On t'a envoyé un lien de confirmation <strong className="text-white">et un email de bienvenue</strong>.
            Clique sur le lien pour activer ton compte RegenX.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-black">R</span>
          </div>
          <h1 className="text-3xl font-black text-white">RegenX</h1>
          <p className="text-slate-400 mt-1">Commence ton parcours fitness IA</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Créer un compte gratuit</h2>
          <p className="text-slate-400 text-sm mb-6">14 jours d'essai — aucune carte requise.</p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Prénom & Nom</label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Marie Dupont"
                {...register('fullName')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.fullName ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Adresse email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="toi@exemple.com"
                {...register('email')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="8+ caractères, 1 majuscule, 1 chiffre"
                {...register('password')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* GDPR */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="gdpr"
                {...register('gdpr')}
                className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="gdpr" className="text-sm text-slate-400 cursor-pointer">
                {"J'accepte les "}
                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition">CGU</Link>
                {' et la '}
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition">politique de confidentialité</Link>
                {' (obligatoire — conformité RGPD)'}
              </label>
            </div>
            {errors.gdpr && <p className="text-xs text-red-400 -mt-2">{errors.gdpr.message}</p>}

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
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte gratuit'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
