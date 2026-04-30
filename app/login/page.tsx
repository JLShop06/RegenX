'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5">
        <h1 className="text-2xl font-bold">Connexion à RegenX</h1>
        <p className="text-sm text-slate-600">Accède à ton coach IA et programmes personnalisés.</p>
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg" />
        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" className="w-full p-3 border rounded-lg" />
        <button disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition">{loading ? 'Connexion...' : 'Se connecter'}</button>
        <p className="text-sm text-center text-slate-600">Pas encore de compte ? <Link href="/register" className="text-emerald-600 font-semibold">S'inscrire</Link></p>
      </form>
    </main>
  );
}
