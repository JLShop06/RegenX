import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/progress - Récupérer les entrées de progression (30 derniers jours par défaut)
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '30');
  const from = searchParams.get('from'); // date ISO optionnelle
  const to = searchParams.get('to');     // date ISO optionnelle

  let query = supabase
    .from('progress_tracking')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(Math.min(limit, 365)); // max 1 an

  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

// POST /api/progress - Enregistrer une nouvelle entrée de progression
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const {
    date,
    weight_kg,
    body_fat_percent,
    muscle_mass_kg,
    energy_level,
    sleep_hours,
    sleep_quality,
    stress_level,
    workout_completed,
    notes,
    photos,
  } = body;

  if (!date) return NextResponse.json({ error: 'La date est requise' }, { status: 400 });

  // Validation des valeurs de 1 à 10
  for (const [key, val] of [
    ['energy_level', energy_level],
    ['sleep_quality', sleep_quality],
    ['stress_level', stress_level],
  ] as [string, unknown][]) {
    if (val !== null && val !== undefined) {
      const n = Number(val);
      if (n < 1 || n > 10) {
        return NextResponse.json({ error: `${key} doit être entre 1 et 10` }, { status: 400 });
      }
    }
  }

  const { data, error } = await supabase
    .from('progress_tracking')
    .insert({
      user_id: user.id,
      date,
      weight_kg: weight_kg ?? null,
      body_fat_percent: body_fat_percent ?? null,
      muscle_mass_kg: muscle_mass_kg ?? null,
      energy_level: energy_level ?? null,
      sleep_hours: sleep_hours ?? null,
      sleep_quality: sleep_quality ?? null,
      stress_level: stress_level ?? null,
      workout_completed: workout_completed ?? false,
      notes: notes ?? null,
      photos: photos ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data }, { status: 201 });
}

// PUT /api/progress - Mettre à jour une entrée existante
export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  // Vérification de propriété
  const { data: existing } = await supabase
    .from('progress_tracking')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('progress_tracking')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

// DELETE /api/progress?id=xxx - Supprimer une entrée
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  const { data: existing } = await supabase
    .from('progress_tracking')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { error } = await supabase.from('progress_tracking').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
