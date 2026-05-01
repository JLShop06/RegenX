'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type ProgressEntry = {
  id: string;
  date: string;
  weight_kg: number | null;
  body_fat_percent: number | null;
  muscle_mass_kg: number | null;
  energy_level: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
  stress_level: number | null;
  workout_completed: boolean;
  notes: string | null;
};

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  weight_kg: '',
  body_fat_percent: '',
  muscle_mass_kg: '',
  energy_level: '',
  sleep_hours: '',
  sleep_quality: '',
  stress_level: '',
  workout_completed: false,
  notes: '',
};

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);
    setEntries(data || []);
    setLoading(false);
  }

  async function saveEntry(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      date: form.date,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      body_fat_percent: form.body_fat_percent ? parseFloat(form.body_fat_percent) : null,
      muscle_mass_kg: form.muscle_mass_kg ? parseFloat(form.muscle_mass_kg) : null,
      energy_level: form.energy_level ? parseInt(form.energy_level) : null,
      sleep_hours: form.sleep_hours ? parseFloat(form.sleep_hours) : null,
      sleep_quality: form.sleep_quality ? parseInt(form.sleep_quality) : null,
      stress_level: form.stress_level ? parseInt(form.stress_level) : null,
      workout_completed: form.workout_completed,
      notes: form.notes || null,
    };

    const { error } = await supabase.from('progress_tracking').insert(payload);
    if (error) {
      setMsg('Erreur lors de la sauvegarde. Réessaie.');
    } else {
      setMsg('Entrée sauvegardée !');
      setForm(emptyForm);
      setShowForm(false);
      loadEntries();
    }
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    if (!confirm('Supprimer cette entrée ?')) return;
    const supabase = createClient();
    await supabase.from('progress_tracking').delete().eq('id', id);
    loadEntries();
  }

  function renderLevel(value: number | null, max = 10) {
    if (!value) return null;
    const pct = (value / max) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-emerald-500 h-1.5 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-600 w-4">{value}</span>
      </div>
    );
  }

  const latestEntry = entries[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-emerald-700">← RegenX</Link>
          <h1 className="font-semibold">Ma Progression</h1>
          <Link href="/account" className="text-sm text-slate-600">Compte</Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Suivi de progression</h2>
            <p className="text-slate-600 text-sm mt-1">{entries.length} entrée(s) enregistrée(s)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
          >
            {showForm ? '✕ Fermer' : '+ Nouvelle entrée'}
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl mb-6 ${
            msg.includes('Erreur')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {msg}
          </div>
        )}

        {showForm && (
          <form onSubmit={saveEntry} className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-emerald-200">
            <h3 className="font-bold text-lg mb-6">Nouvelle entrée de progression</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ex: 75.5"
                  value={form.weight_kg}
                  onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">% Masse grasse</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ex: 18.5"
                  value={form.body_fat_percent}
                  onChange={e => setForm({ ...form, body_fat_percent: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Masse musculaire (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ex: 35.0"
                  value={form.muscle_mass_kg}
                  onChange={e => setForm({ ...form, muscle_mass_kg: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Énergie (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1 à 10"
                  value={form.energy_level}
                  onChange={e => setForm({ ...form, energy_level: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Heures de sommeil</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="ex: 7.5"
                  value={form.sleep_hours}
                  onChange={e => setForm({ ...form, sleep_hours: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qualité du sommeil (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1 à 10"
                  value={form.sleep_quality}
                  onChange={e => setForm({ ...form, sleep_quality: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Niveau de stress (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1 à 10"
                  value={form.stress_level}
                  onChange={e => setForm({ ...form, stress_level: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.workout_completed}
                  onChange={e => setForm({ ...form, workout_completed: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm font-medium text-slate-700">Séance d'entraînement complétée aujourd'hui</span>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                placeholder="Comment tu te sens ? Remarques particulières..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-lg resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-slate-200 hover:bg-slate-50 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {latestEntry && !showForm && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {latestEntry.weight_kg && (
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-slate-800">{latestEntry.weight_kg}</div>
                <div className="text-xs text-slate-500 mt-1">kg • Poids</div>
              </div>
            )}
            {latestEntry.energy_level && (
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-emerald-600">{latestEntry.energy_level}/10</div>
                <div className="text-xs text-slate-500 mt-1">⚡ Énergie</div>
              </div>
            )}
            {latestEntry.sleep_hours && (
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-blue-600">{latestEntry.sleep_hours}h</div>
                <div className="text-xs text-slate-500 mt-1">😴 Sommeil</div>
              </div>
            )}
            {latestEntry.stress_level && (
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-amber-500">{latestEntry.stress_level}/10</div>
                <div className="text-xs text-slate-500 mt-1">🧘 Stress</div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Chargement...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="font-semibold text-xl mb-2">Commence à suivre ta progression</h3>
            <p className="text-slate-500 text-sm mb-6">
              Enregistre ton poids, ton énergie, ton sommeil et ton stress pour visualiser tes progrès
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            >
              + Ajouter ma première entrée
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    {entry.workout_completed && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✅ Séance complétée</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {entry.weight_kg && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">⚖️ Poids</div>
                      <div className="font-semibold">{entry.weight_kg} kg</div>
                    </div>
                  )}
                  {entry.body_fat_percent && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">🔵 Masse grasse</div>
                      <div className="font-semibold">{entry.body_fat_percent}%</div>
                    </div>
                  )}
                  {entry.muscle_mass_kg && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">💪 Masse musculaire</div>
                      <div className="font-semibold">{entry.muscle_mass_kg} kg</div>
                    </div>
                  )}
                  {entry.sleep_hours && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">😴 Sommeil</div>
                      <div className="font-semibold">{entry.sleep_hours}h</div>
                    </div>
                  )}
                </div>

                {(entry.energy_level || entry.sleep_quality || entry.stress_level) && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    {entry.energy_level && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500 w-24">⚡ Énergie</span>
                        {renderLevel(entry.energy_level)}
                      </div>
                    )}
                    {entry.sleep_quality && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500 w-24">😴 Qualité</span>
                        {renderLevel(entry.sleep_quality)}
                      </div>
                    )}
                    {entry.stress_level && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500 w-24">🧘 Stress</span>
                        {renderLevel(entry.stress_level)}
                      </div>
                    )}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 italic">"{entry.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
