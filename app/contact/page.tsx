'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageSquare, Shield, Clock } from 'lucide-react';

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
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || 'Erreur lors de l\'envoi');
      }
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erreur inattendue. Réessayez.');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Message envoyé !</h1>
          <p className="text-gray-400 mb-8">
            Nous vous répondrons sous 24h (jours ouvrés). Un email de confirmation vous a été envoyé.
          </p>
          <Link href="/" className="text-green-400 hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-lg w-8 h-8 flex items-center justify-center font-black">R</span>
            RegenX
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
            Tableau de bord
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Contactez-nous</h1>
          <p className="text-gray-400 text-lg">Notre équipe est là pour vous aider.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Temps de réponse</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Réponse sous <strong className="text-white">24h</strong> en jours ouvrés (lun-ven, 9h-18h CET)
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Email direct</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">Support : <a href="mailto:support@regenx.app" className="text-green-400 hover:underline">support@regenx.app</a></p>
                <p className="text-gray-400">DPO / RGPD : <a href="mailto:dpo@regenx.app" className="text-green-400 hover:underline">dpo@regenx.app</a></p>
                <p className="text-gray-400">Presse : <a href="mailto:press@regenx.app" className="text-green-400 hover:underline">press@regenx.app</a></p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Données & RGPD</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Pour exercer vos droits (accès, suppression, portabilité), rendez-vous sur{' '}
                <Link href="/gdpr" className="text-green-400 hover:underline">la page RGPD</Link>.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Liens utiles</h3>
              </div>
              <div className="space-y-1 text-sm">
                <Link href="/mentions-legales" className="block text-gray-400 hover:text-green-400 transition-colors">Mentions légales</Link>
                <Link href="/privacy" className="block text-gray-400 hover:text-green-400 transition-colors">Politique de confidentialité</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-green-400 transition-colors">CGU</Link>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Envoyer un message</h2>

              {serverError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Marie Dupont"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Adresse email</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="toi@exemple.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sujet</label>
                  <select
                    {...register('subject')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="">Sélectionnez un sujet...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="Décrivez votre demande en détail..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register('gdpr')}
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-600 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-400">
                      J&apos;accepte que RegenX traite mes données pour répondre à ma demande, conformément à la{' '}
                      <Link href="/privacy" className="text-green-400 hover:underline">politique de confidentialité</Link>.
                      {' '}(Obligatoire — RGPD)
                    </span>
                  </label>
                  {errors.gdpr && <p className="text-red-400 text-xs mt-1">{errors.gdpr.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
                  }
