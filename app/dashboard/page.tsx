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
  const { data: workouts } = await supabase.from('workouts').select('id, completed_at').eq('user_id', user.id);
  const { data: nutritionPlans } = await supabase.from('nutrition_plans').select('id, active').eq('user_id', user.id);
  const { data: progressEntries } = await supabase.from('progress_tracking').select('id, date').eq('user_id', user.id).order('date', { ascending: false }).limit(1);

  const completedWorkouts = workouts?.filter(w => w.completed_at).length || 0;
  const activePlan = nutritionPlans?.find(p => p.active);
  const lastProgress = progressEntries?.[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-emerald-700">RegenX</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard" className="font-semibold text-emerald-700">Tableau de bord</Link>
            <Link href="/dashboard/coach">Coach IA</Link>
            <Link href="/dashboard/workouts">Programmes</Link>
            <Link href="/dashboard/nutrition">Nutrition</Link>
            <Link href="/dashboard/progress">Progression</Link>
            <Link href="/account">Compte</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Bonjour {profile?.full_name || user.email} 👋</h1>
        <p className="text-slate-600 mb-8">Prêt à progresser aujourd'hui ?</p>

        {!active && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mb-8">
            <h2 className="font-bold text-amber-900 mb-2">Débloque RegenX Premium</h2>
            <p className="text-amber-800 text-sm mb-4">Accès illimité au coach IA, programmes personnalisés, nutrition + récupération. 99€/mois.</p>
            <Link href="/pricing" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg">S'abonner →</Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/coach" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-transparent hover:border-emerald-200">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-1">Coach IA</h3>
            <p className="text-sm text-slate-500">Discute avec ton coach 24/7</p>
          </Link>
          <Link href="/dashboard/workouts" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-transparent hover:border-emerald-200">
            <div className="text-3xl mb-3">💪</div>
            <h3 className="font-semibold mb-1">Programmes</h3>
            <p className="text-sm text-slate-500">{workouts?.length || 0} programme(s) · {completedWorkouts} complété(s)</p>
          </Link>
          <Link href="/dashboard/nutrition" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-transparent hover:border-emerald-200">
            <div className="text-3xl mb-3">🥗</div>
            <h3 className="font-semibold mb-1">Nutrition</h3>
            <p className="text-sm text-slate-500">{activePlan ? '1 plan actif' : 'Aucun plan actif'}</p>
          </Link>
          <Link href="/dashboard/progress" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-transparent hover:border-emerald-200">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold mb-1">Progression</h3>
            <p className="text-sm text-slate-500">{lastProgress ? `Dernière entrée: ${new Date(lastProgress.date).toLocaleDateString('fr-FR')}` : 'Aucune entrée'}</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Statut abonnement</h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {subscription?.status || 'inactif'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {active
              ? 'Ton abonnement RegenX Premium est actif. Profite de toutes les fonctionnalités !'
              : 'Passe à Premium pour débloquer le coach IA, la génération de programmes et les plans nutritionnels.'}
          </p>
          {!active && (
            <Link href="/pricing" className="inline-block mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg">
              Voir les offres →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
