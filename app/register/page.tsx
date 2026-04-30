'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    if (!gdpr) { setError('Vous devez accepter la politique de confidentialité (RGPD).'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, marketing_consent: marketing, gdpr_consent: true, gdpr_consent_date: new Date().toISOString() } }
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.session) { router.push('/dashboard'); router.refresh(); }
    else setInfo('Vérifie ton email pour confirmer ton compte.');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-4">
        <h1 className="text-2xl font-bold">Créer un compte RegenX</h1>
        <p className="text-sm text-slate-600">Commence ton parcours santé avec coaching IA personnalisé.</p>
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        {info && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded">{info}</div>}
        <input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Nom complet" className="w-full p-3 border rounded-lg" />
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg" />
        <input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe (8+ caractères)" className="w-full p-3 border rounded-lg" />
        <label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" required checked={gdpr} onChange={e=>setGdpr(e.target.checked)} className="mt-1" /><span>J'accepte la <Link href="/privacy" className="text-emerald-600 underline">politique de confidentialité</Link> et les <Link href="/terms" className="text-emerald-600 underline">CGU</Link>.</span></label>
        <label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)} className="mt-1" /><span>J'accepte de recevoir des emails marketing (optionnel).</span></label>
        <button disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition">{loading ? 'Création...' : 'Créer mon compte'}</button>
        <p className="text-sm text-center text-slate-600">Déjà inscrit ? <Link href="/login" className="text-emerald-600 font-semibold">Se connecter</Link></p>
      </form>
    </main>
  );
}
