import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, isSubscriptionActive, getSubscription } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const active = await isSubscriptionActive(user.id);
  const subscription = await getSubscription(user.id);

  const { data: profile } = await supabase.from('profiles').select('full_name, fitness_level').eq('id', user.id).single();
  const { data: workouts } = await supabase.from('workouts').select('id, name, scheduled_for, completed_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-emerald-700">RegenX</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard" className="font-semibold">Tableau de bord</Link>
            <Link href="/dashboard/coach">Coach IA</Link>
            <Link href="/account">Compte</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Bonjour {profile?.full_name || user.email}</h1>
        <p className="text-slate-600 mb-8">Prêt à progresser aujourd'hui ?</p>

        {!active && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mb-8">
            <h2 className="font-bold text-amber-900 mb-2">Débloque RegenX Premium</h2>
            <p className="text-amber-800 text-sm mb-4">Accès illimité au coach IA, programmes personnalisés, nutrition + récupération. 99€/mois.</p>
            <Link href="/pricing" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg">S'abonner →</Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/coach" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">Coach IA</h3>
            <p className="text-sm text-slate-600">Discute avec ton coach personnel 24/7.</p>
          </Link>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">💪</div>
            <h3 className="font-semibold mb-1">Programmes</h3>
            <p className="text-sm text-slate-600">{workouts?.length || 0} programme(s)</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Statut</h3>
            <p className="text-sm text-slate-600">{subscription?.status || 'inactif'}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
