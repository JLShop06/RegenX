'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, MessageSquare, Shield, Clock } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  subject: z.enum(['support', 'billing', 'privacy', 'partnership', 'other'], {
    errorMap: () => ({ message: 'Choisissez un sujet' }),
  }),
  message: z.string().min(20, 'Message trop court (20 caractères minimum)').max(2000, 'Message trop long'),
  gdpr: z.boolean().refine((v) => v === true, { message: 'Consentement requis' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SUBJECTS = [
  { value: 'support', label: '🛠️ Support technique' },
  { value: 'billing', label: '💳 Facturation / abonnement' },
  { value: 'privacy', label: '🔒 Protection des données (RGPD)' },
  { value: 'partnership', label: '🤝 Partenariat / presse' },
  { value: 'other', label: '💬 Autre' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { gdpr: false },
  });

  async function onSubmit(data: ContactFormData) {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSent(true);
    } catch {
      setServerError('Une erreur est survenue. Réessayez ou écrivez directement à support@regenx.app');
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message envoyé !</h2>
          <p className="text-slate-400 mb-6">
            Nous répondons généralement sous 24h en jours ouvrés.
            Un email de confirmation vous a été envoyé.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition">
            {"Retour à l'accueil"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg">RegenX</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition">
            Tableau de bord
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3">Contactez-nous</h1>
          <p className="text-slate-400 text-lg">{"Notre équipe est là pour vous aider."}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">Temps de réponse</h3>
              </div>
              <p className="text-slate-400 text-sm">Réponse sous <strong className="text-white">24h</strong> en jours ouvrés (lun-ven, 9h-18h CET)</p>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">Email direct</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Support :</span>{' '}
                  <a href="mailto:support@regenx.app" className="text-emerald-400 hover:text-emerald-300">support@regenx.app</a>
                </p>
                <p>
                  <span className="text-slate-500">DPO / RGPD :</span>{' '}
                  <a href="mailto:dpo@regenx.app" className="text-emerald-400 hover:text-emerald-300">dpo@regenx.app</a>
                </p>
                <p>
                  <span className="text-slate-500">Presse :</span>{' '}
                  <a href="mailto:press@regenx.app" className="text-emerald-400 hover:text-emerald-300">press@regenx.app</a>
                </p>
              </div>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">Données & RGPD</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Pour exercer vos droits RGPD (accès, suppression, portabilité), écrivez à{' '}
                <a href="mailto:dpo@regenx.app" className="text-emerald-400 hover:text-emerald-300">dpo@regenx.app</a>.
                Réponse sous 30 jours.
              </p>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">Liens utiles</h3>
              </div>
              <div className="space-y-1 text-sm">
                <Link href="/terms" className="block text-slate-400 hover:text-emerald-400 transition">{"→ Conditions d'utilisation"}</Link>
                <Link href="/privacy" className="block text-slate-400 hover:text-emerald-400 transition">{"→ Politique de confidentialité"}</Link>
                <Link href="/dashboard" className="block text-slate-400 hover:text-emerald-400 transition">{"→ Mon espace"}</Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">Envoyer un message</h2>

            {serverError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Marie Dupont"
                    {...register('name')}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                      ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Adresse email</label>
                  <input
                    type="email"
                    placeholder="toi@exemple.com"
                    {...register('email')}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                      ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sujet</label>
                <select
                  {...register('subject')}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                    ${errors.subject ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="">Sélectionnez un sujet...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                <textarea
                  rows={6}
                  placeholder="Décrivez votre demande en détail..."
                  {...register('message')}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none
                    ${errors.message ? 'border-red-500/50' : 'border-white/10'}`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
              </div>

              {/* GDPR consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="gdpr"
                  {...register('gdpr')}
                  className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="gdpr" className="text-sm text-slate-400 cursor-pointer">
                  {"J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la "}
                  <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
                    {"politique de confidentialité"}
                  </Link>
                  {" (RGPD)."}
                </label>
              </div>
              {errors.gdpr && <p className="text-xs text-red-400 -mt-2">{errors.gdpr.message}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed
                  text-white font-semibold rounded-lg transition shadow-lg shadow-emerald-900/30"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
