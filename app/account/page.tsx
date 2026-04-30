'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      const { data: s } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
      setSub(s);
      setLoading(false);
    })();
  }, [router]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function openPortal() {
    setWorking(true); setMsg(null);
    const res = await fetch('/api/stripe/billing-portal', { method: 'POST' });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else setMsg('Impossible d\'ouvrir le portail.');
    setWorking(false);
  }

  async function exportData() {
    setWorking(true); setMsg(null);
    const res = await fetch('/api/gdpr');
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `regenx-export-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      setMsg('Données exportées.');
    } else setMsg('Export échoué.');
    setWorking(false);
  }

  async function deleteAccount() {
    if (!confirm('Supprimer définitivement votre compte ? Cette action est irréversible.')) return;
    if (!confirm('Confirmation : toutes vos données seront perdues. Continuer ?')) return;
    setWorking(true);
    const res = await fetch('/api/gdpr', { method: 'DELETE' });
    if (res.ok) { router.push('/'); router.refresh(); }
    else setMsg('Suppression échouée.');
    setWorking(false);
  }

  if (loading) return <main className="p-10">Chargement...</main>;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-emerald-700">← RegenX</Link>
          <h1 className="font-semibold">Mon compte</h1>
          <button onClick={logout} className="text-sm text-slate-600 hover:underline">Déconnexion</button>
        </div>
      </header>
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {msg && <div className="p-3 bg-emerald-50 text-emerald-800 rounded">{msg}</div>}

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Profil</h2>
          <p className="text-sm text-slate-600">{user?.email}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Abonnement</h2>
          <p className="text-sm text-slate-600 mb-4">Statut : <span className="font-semibold">{sub?.status || 'inactif'}</span></p>
          {sub?.stripe_customer_id ? (
            <button onClick={openPortal} disabled={working} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg disabled:bg-slate-400">Gérer mon abonnement</button>
          ) : (
            <Link href="/pricing" className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">S'abonner (99€/mois)</Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">RGPD - Mes données</h2>
          <p className="text-sm text-slate-600 mb-4">Conformément au RGPD, tu peux exporter ou supprimer tes données à tout moment.</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={exportData} disabled={working} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg disabled:opacity-50">Exporter mes données</button>
            <button onClick={deleteAccount} disabled={working} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:bg-slate-400">Supprimer mon compte</button>
          </div>
        </div>
      </section>
    </main>
  );
}
