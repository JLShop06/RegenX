import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSubscriptionActive } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/workouts - Récupérer tous les programmes de l'utilisateur
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ workouts: data });
}

// POST /api/workouts - Créer un nouveau programme
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const active = await isSubscriptionActive(user.id);
  if (!active) return NextResponse.json({ error: 'Abonnement requis' }, { status: 402 });

  const body = await request.json();
  const { name, type, difficulty, duration_minutes, description, exercises, scheduled_for } = body;

  if (!name) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });

  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name,
      type: type || 'strength',
      difficulty: difficulty || 'intermediate',
      duration_minutes: duration_minutes || null,
      description: description || null,
      exercises: exercises || [],
      scheduled_for: scheduled_for || null,
      ai_generated: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ workout: data }, { status: 201 });
}

// PUT /api/workouts - Mettre à jour un programme (compléter, modifier)
export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  // S'assurer que l'utilisateur possède ce workout
  const { data: existing } = await supabase
    .from('workouts')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ workout: data });
}

// DELETE /api/workouts?id=xxx - Supprimer un programme
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  // Vérification de propriété
  const { data: existing } = await supabase
    .from('workouts')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
