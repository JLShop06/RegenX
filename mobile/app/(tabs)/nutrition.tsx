import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createClient, isSubscriptionActive } from '../../../lib/supabase/client';

type NutritionPlan = {
  id: string;
  name: string;
  type: string;
  calories_target: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  description: string | null;
  active: boolean;
  ai_generated: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  balanced: '⚖️ Équilibré',
  keto: '🥑 Keto',
  vegan: '🌱 Vegan',
  vegetarian: '🥗 Végétarien',
  paleo: '🍖 Paleo',
  mediterranean: '🫒 Méditerranéen',
};

export default function NutritionScreen() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [active] = await Promise.all([
      isSubscriptionActive(user.id),
      loadPlans(user.id),
    ]);
    setHasSubscription(active);
  }

  async function loadPlans(userId?: string) {
    const supabase = createClient();
    let uid = userId;
    if (!uid) {
      const { data: { user } } = await supabase.auth.getUser();
      uid = user?.id;
    }
    if (!uid) return;
    const { data } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    setPlans(data || []);
    setLoading(false);
  }

  async function generatePlan() {
    if (!hasSubscription) {
      Alert.alert(
        'Abonnement requis',
        'Génère des plans nutritionnels personnalisés avec RegenX Premium (99€/mois).',
        [{ text: 'OK' }]
      );
      return;
    }
    setGenerating(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      // Note: En production, pointer vers votre domaine Vercel
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://your-app.vercel.app'}/api/ai/coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: 'Génère un plan nutritionnel complet. Réponds UNIQUEMENT en JSON valide avec: name, type (balanced|keto|vegan|vegetarian|paleo|mediterranean), calories_target, protein_g, carbs_g, fat_g, description, meals (tableau de repas).'
          }]
        }),
      });

      if (!res.ok) throw new Error('Génération échouée');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let raw = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
      }

      const jsonMatch = raw.match(/{[sS]*}/);
      if (!jsonMatch) throw new Error('Format invalide');
      const plan = JSON.parse(jsonMatch[0]);

      await supabase.from('nutrition_plans').insert({
        user_id: user.id,
        name: plan.name || 'Plan IA',
        type: plan.type || 'balanced',
        calories_target: plan.calories_target || null,
        protein_g: plan.protein_g || null,
        carbs_g: plan.carbs_g || null,
        fat_g: plan.fat_g || null,
        description: plan.description || '',
        meals: plan.meals || [],
        active: true,
        ai_generated: true,
      });

      Alert.alert('✅ Succès', 'Plan nutritionnel généré !');
      loadPlans();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de générer le plan. Réessaie.');
    }
    setGenerating(false);
  }

  async function toggleActive(plan: NutritionPlan) {
    const supabase = createClient();
    await supabase
      .from('nutrition_plans')
      .update({ active: !plan.active })
      .eq('id', plan.id);
    loadPlans();
  }

  async function deletePlan(id: string) {
    Alert.alert('Supprimer', 'Supprimer ce plan nutritionnel ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const supabase = createClient();
          await supabase.from('nutrition_plans').delete().eq('id', id);
          loadPlans();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>{plans.length} plan(s) créé(s)</Text>
        </View>
        <TouchableOpacity
          onPress={generatePlan}
          disabled={generating}
          style={[styles.genBtn, generating && styles.genBtnDisabled]}
        >
          <Text style={styles.genBtnText}>
            {generating ? '⏳' : '🤖 Générer'}
          </Text>
        </TouchableOpacity>
      </View>

      {!hasSubscription && (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumText}>
            🔒 Génération IA disponible avec RegenX Premium
          </Text>
        </View>
      )}

      {plans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🥗</Text>
          <Text style={styles.emptyTitle}>Aucun plan nutritionnel</Text>
          <Text style={styles.emptySub}>
            Génère ton premier plan nutritionnel personnalisé avec l'IA
          </Text>
          <TouchableOpacity
            onPress={generatePlan}
            disabled={generating}
            style={styles.emptyBtn}
          >
            <Text style={styles.emptyBtnText}>
              {generating ? 'Génération...' : '🤖 Générer mon premier plan'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.plansList}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.active && styles.planCardActive,
              ]}
            >
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.badges}>
                    {plan.ai_generated && (
                      <View style={styles.badgeAI}>
                        <Text style={styles.badgeAIText}>🤖 IA</Text>
                      </View>
                    )}
                    {plan.active && (
                      <View style={styles.badgeActive}>
                        <Text style={styles.badgeActiveText}>✓ Actif</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => deletePlan(plan.id)}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.planType}>
                {TYPE_LABELS[plan.type] || plan.type}
              </Text>

              {plan.description ? (
                <Text style={styles.planDesc} numberOfLines={2}>
                  {plan.description}
                </Text>
              ) : null}

              {(plan.calories_target || plan.protein_g || plan.carbs_g || plan.fat_g) ? (
                <View style={styles.macroRow}>
                  {plan.calories_target ? (
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{plan.calories_target}</Text>
                      <Text style={styles.macroLabel}>kcal</Text>
                    </View>
                  ) : null}
                  {plan.protein_g ? (
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: '#3b82f6' }]}>{plan.protein_g}g</Text>
                      <Text style={styles.macroLabel}>Protéines</Text>
                    </View>
                  ) : null}
                  {plan.carbs_g ? (
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: '#f59e0b' }]}>{plan.carbs_g}g</Text>
                      <Text style={styles.macroLabel}>Glucides</Text>
                    </View>
                  ) : null}
                  {plan.fat_g ? (
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: '#ef4444' }]}>{plan.fat_g}g</Text>
                      <Text style={styles.macroLabel}>Lipides</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => toggleActive(plan)}
                style={[
                  styles.toggleBtn,
                  plan.active ? styles.toggleBtnActive : styles.toggleBtnInactive,
                ]}
              >
                <Text style={[
                  styles.toggleBtnText,
                  plan.active ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
                ]}>
                  {plan.active ? 'Désactiver' : '▶ Activer ce plan'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  genBtn: { backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  genBtnDisabled: { backgroundColor: '#94a3b8' },
  genBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  premiumBanner: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fefce8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  premiumText: { fontSize: 13, color: '#92400e', textAlign: 'center' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyBtn: { backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#ffffff', fontWeight: '700' },
  plansList: { padding: 16, gap: 16 },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planCardActive: { borderLeftColor: '#059669' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  planTitleRow: { flex: 1, flexDirection: 'column', gap: 4 },
  planName: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  badges: { flexDirection: 'row', gap: 6 },
  badgeAI: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeAIText: { fontSize: 11, color: '#059669', fontWeight: '600' },
  badgeActive: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeActiveText: { fontSize: 11, color: '#2563eb', fontWeight: '600' },
  deleteBtn: { fontSize: 18, color: '#cbd5e1', padding: 4 },
  planType: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  planDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 12 },
  macroRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  macroLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  toggleBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#f1f5f9' },
  toggleBtnInactive: { backgroundColor: '#059669' },
  toggleBtnText: { fontSize: 14, fontWeight: '700' },
  toggleBtnTextActive: { color: '#64748b' },
  toggleBtnTextInactive: { color: '#ffffff' },
});
