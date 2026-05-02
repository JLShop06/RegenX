'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Workout = {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration_minutes: number | null;
  completed_at: string | null;
  scheduled_for: string | null;
  ai_generated: boolean;
  description: string | null;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setWorkouts(data || []);
    setLoading(false);
  }

  async function generateWorkout() {
    setGenerating(true);
    setMsg(null);
    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
                    content: Génère un programme d'entraînement complet. Réponds UNIQUEMENT en JSON valide avec: name, type (strength|cardio|hiit|yoga|recovery|mobility), difficulty (beginner|intermediate|advanced), duration_minutes, description, exercises (tableau avec name, sets, reps, rest_seconds).
        }]
      })
    });
    if (res.status === 402) {
      setMsg('Abonnement requis pour générer des programmes IA.');
      setGenerating(false);
      return;
    }
    if (!res.ok) {
      setMsg('Erreur lors de la génération.');
      setGenerating(false);
      return;
    }
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let raw = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }
    try {
      const jsonMatch = raw.match(/{[sS]*}/);
      if (!jsonMatch) throw new Error('Pas de JSON');
      const plan = JSON.parse(jsonMatch[0]);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('workouts').insert({
        user_id: user.id,
        name: plan.name || 'Programme IA',
        type: plan.type || 'strength',
        difficulty: plan.difficulty || 'intermediate',
        duration_minutes: plan.duration_minutes || 45,
        description: plan.description || '',
        exercises: plan.exercises || [],
        ai_generated: true,
      });
      if (error) throw error;
      setMsg('Programme généré et sauvegardé !');
      loadWorkouts();
    } catch {
      setMsg('Programme reçu mais impossible de le structurer. Réessaie.');
    }
    setGenerating(false);
  }

  async function toggleComplete(w: Workout) {
    const supabase = createClient();
    await supabase
      .from('workouts')
      .update({ completed_at: w.completed_at ? null : new Date().toISOString() })
      .eq('id', w.id);
    loadWorkouts();
  }

  async function deleteWorkout(id: string) {
    if (!confirm('Supprimer ce programme ?')) return;
    const supabase = createClient();
    await supabase.from('workouts').delete().eq('id', id);
    loadWorkouts();
  }

  const typeLabels: Record<string, string> = {
    strength: '💪 Force',
    cardio: '🏃 Cardio',
    hiit: '⚡ HIIT',
    yoga: '🧘 Yoga',
    recovery: '🛁 Récupération',
    mobility: '🤸 Mobilité',
  };

  const diffLabels: Record<string, string> = {
    beginner: '🟢 Débutant',
    intermediate: '🟡 Intermédiaire',
    advanced: '🔴 Avancé',
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-emerald-700">← RegenX</Link>
          <h1 className="font-semibold">Mes Programmes</h1>
          <Link href="/account" className="text-sm text-slate-600">Compte</Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Programmes d'entraînement</h2>
            <p className="text-slate-600 text-sm mt-1">{workouts.length} programme(s) créé(s)</p>
          </div>
          <button
            onClick={generateWorkout}
            disabled={generating}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg"
          >
            {generating ? '⏳ Génération...' : '🤖 Générer avec IA'}
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl mb-6 ${
            msg.includes('requis') || msg.includes('Erreur') || msg.includes('impossible')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {msg}
            {msg.includes('requis') && (
              <Link href="/pricing" className="ml-2 underline font-semibold">Voir l'abonnement →</Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Chargement...</div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">💪</div>
            <h3 className="font-semibold text-xl mb-2">Aucun programme pour l'instant</h3>
            <p className="text-slate-500 text-sm mb-6">Génère ton premier programme d'entraînement personnalisé avec l'IA RegenX</p>
            <button
              onClick={generateWorkout}
              disabled={generating}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            >
              {generating ? 'Génération en cours...' : '🤖 Générer mon premier programme'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {workouts.map((w) => (
              <div
                key={w.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 transition ${
                  w.completed_at ? 'border-emerald-400 opacity-80' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{w.name}</h3>
                      {w.ai_generated && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">🤖 IA</span>
                      )}
                    </div>
                    {w.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">{w.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteWorkout(w.id)}
                    className="text-slate-300 hover:text-red-500 ml-2 text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    {typeLabels[w.type] || w.type}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    {diffLabels[w.difficulty] || w.difficulty}
                  </span>
                  {w.duration_minutes && (
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      ⏱ {w.duration_minutes} min
                    </span>
                  )}
                  {w.completed_at && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      ✅ Complété
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleComplete(w)}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                    w.completed_at
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {w.completed_at ? '↩ Marquer comme non fait' : '▶ Marquer comme complété'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
