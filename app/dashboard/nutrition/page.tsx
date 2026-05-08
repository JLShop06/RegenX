import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, LogOut, Zap, Crown, Flame, Droplets, Fish, Leaf, Clock, ChevronRight } from 'lucide-react';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const navItems = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

type Repas = {
  moment: string;
  nom: string;
  description: string;
  ingredients: string[];
  macros: { kcal: number; proteines: number; glucides: number; lipides: number };
  prep: string;
  tag?: string;
};

type PlanSemaine = {
  phase: string;
  objectif: string;
  calories: number;
  jours: { nom: string; repas: Repas[] }[];
};

const planNutrition: Record<number, PlanSemaine> = {
  1: {
    phase: 'Fondations Nutritionnelles',
    objectif: 'Établir de bonnes habitudes, apport protéique suffisant',
    calories: 2400,
    jours: [
      {
        nom: 'Lundi — Jour de training Push',
        repas: [
          {
            moment: 'Petit-déjeuner 7h30',
            nom: 'Porridge protéiné & fruits rouges',
            description: 'Base d\'avoine complète pour l\'énergie durable, enrichie en protéines de lactosérum.',
            ingredients: ['80g flocons d\'avoine', '1 scoop whey vanille (25g)', '200ml lait demi-écrémé', '100g fruits rouges congelés', '1 c.s. graines de chia', '5g miel'],
            macros: { kcal: 520, proteines: 38, glucides: 62, lipides: 9 },
            prep: '5 min',
            tag: 'Pré-entraînement idéal',
          },
          {
            moment: 'Déjeuner 12h30',
            nom: 'Bowl poulet grillé & quinoa',
            description: 'Protéines complètes et glucides complexes pour soutenir la récupération musculaire.',
            ingredients: ['180g filet poulet grillé', '100g quinoa cuit', '80g épinards frais', '1/2 avocat', '10 tomates cerises', '1 c.s. huile d\'olive', 'jus de citron, sel, poivre'],
            macros: { kcal: 680, proteines: 52, glucides: 48, lipides: 22 },
            prep: '15 min',
          },
          {
            moment: 'Collation 16h',
            nom: 'Skyr & amandes',
            description: 'Protéines lentes et graisses saines pour tenir jusqu\'au dîner.',
            ingredients: ['200g skyr nature', '20g amandes entières', '1 c.c. miel', '1/2 pomme'],
            macros: { kcal: 280, proteines: 22, glucides: 24, lipides: 10 },
            prep: '2 min',
          },
          {
            moment: 'Dîner 19h30',
            nom: 'Saumon rôti & patate douce',
            description: 'Oméga-3 anti-inflammatoires et glucides à index glycémique modéré pour la récupération nocturne.',
            ingredients: ['200g pavé de saumon', '200g patate douce', '150g brocolis', '1 c.s. huile de coco', 'ail, citron, aneth', 'sel, poivre'],
            macros: { kcal: 620, proteines: 42, glucides: 45, lipides: 28 },
            prep: '25 min',
            tag: 'Anti-inflammatoire ✓',
          },
          {
            moment: 'Avant coucher 22h',
            nom: 'Caséine & noix',
            description: 'Protéines à digestion lente pour maintenir la synthèse protéique pendant le sommeil.',
            ingredients: ['200ml lait chaud', '1 scoop caséine chocolat', '15g noix de cajou'],
            macros: { kcal: 290, proteines: 28, glucides: 18, lipides: 11 },
            prep: '2 min',
            tag: 'Récupération nocturne',
          },
        ],
      },
      {
        nom: 'Mardi — Jour de training Pull',
        repas: [
          {
            moment: 'Petit-déjeuner 7h30',
            nom: 'Oeufs brouillés & pain complet',
            description: 'Protéines complètes avec acides aminés essentiels pour démarrer la journée.',
            ingredients: ['3 oeufs entiers', '2 tranches pain complet', '1/2 avocat', '30g fromage blanc 0%', 'ciboulette, sel, poivre'],
            macros: { kcal: 490, proteines: 30, glucides: 38, lipides: 22 },
            prep: '8 min',
          },
          {
            moment: 'Déjeuner 12h30',
            nom: 'Steak haché & riz basmati',
            description: 'Fer, zinc et créatine naturelle du bœuf pour les performances en salle.',
            ingredients: ['180g steak haché 5% MG', '100g riz basmati cuit', '200g haricots verts', '1/2 oignon rouge', '1 c.s. sauce tomate maison', 'herbes de Provence'],
            macros: { kcal: 640, proteines: 48, glucides: 54, lipides: 16 },
            prep: '20 min',
          },
          {
            moment: 'Collation 16h',
            nom: 'Shake récup post-training',
            description: 'Fenêtre anabolique : glucides rapides + protéines pour la reconstruction musculaire.',
            ingredients: ['1 scoop whey chocolat', '1 banane', '250ml lait d\'avoine', '5g créatine monohydrate'],
            macros: { kcal: 380, proteines: 32, glucides: 48, lipides: 6 },
            prep: '2 min',
            tag: 'Post-training obligatoire',
          },
          {
            moment: 'Dîner 19h30',
            nom: 'Blanc de dinde & légumes rôtis',
            description: 'Protéines maigres et légumes riches en micronutriments pour la récupération.',
            ingredients: ['200g blanc de dinde', '150g courgettes', '100g poivrons', '80g champignons', '1 c.s. huile d\'olive', 'thym, romarin, ail'],
            macros: { kcal: 420, proteines: 45, glucides: 20, lipides: 16 },
            prep: '25 min',
          },
        ],
      },
    ],
  },
  2: {
    phase: 'Optimisation Métabolique',
    objectif: 'Augmenter l\'apport calorique +200kcal, optimiser le timing nutritionnel',
    calories: 2600,
    jours: [
      {
        nom: 'Lundi — Jour Push + Force',
        repas: [
          {
            moment: 'Petit-déjeuner 7h',
            nom: 'Pancakes protéinés & sirop d\'érable',
            description: 'Version sportive des pancakes pour une énergie optimale avant l\'entraînement lourd.',
            ingredients: ['100g farine d\'avoine', '2 oeufs', '1 scoop whey vanille', '150ml lait', '1 c.s. huile de coco', '15ml sirop d\'érable pur', '100g myrtilles'],
            macros: { kcal: 620, proteines: 44, glucides: 72, lipides: 16 },
            prep: '12 min',
            tag: 'Charge glucidique ✓',
          },
          {
            moment: 'Déjeuner 12h30',
            nom: 'Tartare de thon & avocat',
            description: 'Acides gras oméga-3 + protéines nobles pour la performance et la récupération.',
            ingredients: ['200g thon frais (ou conserve eau)', '1 avocat mûr', '1/2 concombre', '1 citron vert', 'sauce soja légère', 'gingembre frais râpé', '80g riz basmati'],
            macros: { kcal: 580, proteines: 48, glucides: 32, lipides: 26 },
            prep: '10 min',
          },
          {
            moment: 'Collation 15h30 (Pré-training)',
            nom: 'Riz gâteau de riz & whey',
            description: 'Glucides complexes 1h30 avant l\'entraînement pour maintenir la glycémie.',
            ingredients: ['100g riz gâteau (prêt à manger)', '1 scoop whey', '1 banane', '10g beurre de cacahuète naturel'],
            macros: { kcal: 420, proteines: 30, glucides: 56, lipides: 8 },
            prep: '3 min',
            tag: 'Pré-training 90min avant',
          },
          {
            moment: 'Dîner 19h30',
            nom: 'Côtes d\'agneau & patate douce',
            description: 'Protéines riches en leucine et glycogène musculaire pour la reconstruction après l\'entraînement.',
            ingredients: ['2 côtes d\'agneau (250g)', '200g patate douce rôtie', '150g asperges vertes', '1 c.s. huile d\'olive', 'romarin frais, ail, fleur de sel'],
            macros: { kcal: 720, proteines: 50, glucides: 42, lipides: 34 },
            prep: '30 min',
            tag: 'Repas de récup premium',
          },
          {
            moment: 'Avant coucher 22h',
            nom: 'Cottage cheese & fruits secs',
            description: 'Caséine naturelle du cottage cheese pour la synthèse protéique nocturne.',
            ingredients: ['200g cottage cheese', '30g noix mélangées', '10g graines de courge', '1 c.c. cannelle'],
            macros: { kcal: 340, proteines: 30, glucides: 14, lipides: 18 },
            prep: '2 min',
          },
        ],
      },
      {
        nom: 'Mercredi — Jour de repos actif',
        repas: [
          {
            moment: 'Petit-déjeuner 8h',
            nom: 'Smoothie bowl vert & graines',
            description: 'Micronutriments, antioxydants et digestion optimisée pour le jour de récupération.',
            ingredients: ['150g épinards', '1 banane congelée', '150ml lait de coco', '1 scoop whey', '2 c.s. granola maison', '10g graines de lin', '80g kiwi'],
            macros: { kcal: 480, proteines: 34, glucides: 52, lipides: 14 },
            prep: '5 min',
            tag: 'Récupération & détox',
          },
          {
            moment: 'Déjeuner 12h30',
            nom: 'Salade niçoise au thon',
            description: 'Repas léger et équilibré pour les jours sans entraînement intense.',
            ingredients: ['150g thon en conserve', '2 oeufs durs', '100g haricots verts', '80g tomates', '50g olives', '30g mesclun', '1 c.s. huile d\'olive', 'vinaigre balsamique'],
            macros: { kcal: 480, proteines: 42, glucides: 18, lipides: 26 },
            prep: '10 min',
          },
          {
            moment: 'Dîner 19h',
            nom: 'Curry de pois chiches & riz complet',
            description: 'Légumineuses riches en fibre, magnésium et protéines végétales pour la récupération digestive.',
            ingredients: ['200g pois chiches', '100g riz complet', '150ml lait de coco', '100g épinards', 'oignon, ail, gingembre', 'curcuma, cumin, coriandre'],
            macros: { kcal: 620, proteines: 24, glucides: 82, lipides: 18 },
            prep: '25 min',
            tag: 'Repas végétal anti-inflammatoire',
          },
        ],
      },
    ],
  },
  3: {
    phase: 'Peak Performance',
    objectif: 'Pic de performance — charge glucidique sur jours d\'entraînement, déficit léger les autres',
    calories: 2800,
    jours: [
      {
        nom: 'Lundi — Entraînement lourd',
        repas: [
          {
            moment: 'Petit-déjeuner 7h',
            nom: 'Bagel complet oeufs & saumon fumé',
            description: 'Charge glucidique matinale pour préparer l\'entraînement lourd de la journée.',
            ingredients: ['2 bagels complets', '3 oeufs pochés', '100g saumon fumé', '30g cream cheese allégé', 'câpres, aneth', 'jus de citron'],
            macros: { kcal: 740, proteines: 52, glucides: 80, lipides: 22 },
            prep: '15 min',
            tag: 'Charge glucidique maximale',
          },
          {
            moment: 'Déjeuner 12h',
            nom: 'Bœuf haché & pâtes complètes',
            description: 'Carburant ultime avant une séance de force : glucides complexes et protéines complètes.',
            ingredients: ['200g bœuf haché 5% MG', '120g pâtes complètes cuites', '150g sauce tomate maison', '50g parmesan', 'basilic frais', 'ail, oignon'],
            macros: { kcal: 780, proteines: 60, glucides: 72, lipides: 24 },
            prep: '20 min',
          },
          {
            moment: 'Pré-training 16h',
            nom: 'Banane & beurre de cacahuète',
            description: 'Glucides rapides + graisses saines 45min avant la séance pour l\'énergie immédiate.',
            ingredients: ['2 bananes mûres', '25g beurre de cacahuète naturel', '1 café noir (optionnel)'],
            macros: { kcal: 300, proteines: 8, glucides: 50, lipides: 10 },
            prep: '1 min',
            tag: '45min avant l\'entraînement',
          },
          {
            moment: 'Post-training 19h30',
            nom: 'Shake de récupération pro',
            description: 'Reconstituer le glycogène et lancer la synthèse protéique dans les 30min suivant l\'effort.',
            ingredients: ['2 scoops whey isolat chocolat', '300ml lait demi-écrémé', '1 banane', '5g créatine', '3g bêta-alanine'],
            macros: { kcal: 480, proteines: 56, glucides: 44, lipides: 8 },
            prep: '2 min',
            tag: 'OBLIGATOIRE dans les 30min',
          },
          {
            moment: 'Dîner 21h',
            nom: 'Filet mignon & risotto quinoa',
            description: 'Repas de récupération premium : protéines nobles et glucides complexes pour la nuit.',
            ingredients: ['200g filet mignon de porc', '100g quinoa', '150g champignons', '1 échalote', '50ml crème légère', 'thym, romarin'],
            macros: { kcal: 650, proteines: 55, glucides: 48, lipides: 22 },
            prep: '30 min',
            tag: 'Récupération optimale',
          },
        ],
      },
    ],
  },
};

export default async function NutritionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const createdAt = new Date(user.created_at);
  const now = new Date();
  const diffWeeks = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const currentWeek = Math.min(Math.max(diffWeeks + 1, 1), 12);
  const phase = Math.min(Math.ceil(currentWeek / 4), 3) as 1 | 2 | 3;

  const currentPlan = planNutrition[phase];

  const macroTotaux = { kcal: currentPlan.calories, proteines: Math.round(currentPlan.calories * 0.35 / 4), glucides: Math.round(currentPlan.calories * 0.45 / 4), lipides: Math.round(currentPlan.calories * 0.20 / 9) };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      <aside style={{ width: '240px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.12)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(200,146,42,0.1)' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '3px', textDecoration: 'none', color: item.href === '/dashboard/nutrition' ? GOLD : 'rgba(255,255,255,0.45)', backgroundColor: item.href === '/dashboard/nutrition' ? 'rgba(200,146,42,0.08)' : 'transparent', fontSize: '0.82rem', fontWeight: item.href === '/dashboard/nutrition' ? 600 : 400, letterSpacing: '0.02em', borderLeft: item.href === '/dashboard/nutrition' ? '2px solid ' + GOLD : '2px solid transparent' }}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 0.85rem', borderRadius: '3px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', cursor: 'pointer' }}>
              <LogOut style={{ width: '16px', height: '16px' }} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>★ Plan Nutritionnel</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Nutrition</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{currentPlan.phase} — Semaine {currentWeek}/12</p>
        </div>

        {/* Macros du jour */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Calories', value: macroTotaux.kcal + ' kcal', icon: Flame, color: GOLD },
            { label: 'Protéines', value: macroTotaux.proteines + 'g', icon: Fish, color: '#E8B84B' },
            { label: 'Glucides', value: macroTotaux.glucides + 'g', icon: Leaf, color: '#6BCB77' },
            { label: 'Lipides', value: macroTotaux.lipides + 'g', icon: Droplets, color: '#4DA8FF' },
          ].map((macro, i) => (
            <div key={i} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <macro.icon style={{ width: '14px', height: '14px', color: macro.color }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{macro.label}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: macro.color, letterSpacing: '-0.02em' }}>{macro.value}</div>
            </div>
          ))}
        </div>

        {/* Objectif phase */}
        <div style={{ background: 'linear-gradient(135deg, rgba(200,146,42,0.08) 0%, rgba(200,146,42,0.02) 100%)', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Crown style={{ width: '14px', height: '14px', color: GOLD }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Objectif Phase {phase}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{currentPlan.objectif}</p>
        </div>

        {/* Plans par jour */}
        {currentPlan.jours.map((jour, jourIdx) => (
          <div key={jourIdx} style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(200,146,42,0.15)' }}>
              {jour.nom}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jour.repas.map((repas, repasIdx) => (
                <div key={repasIdx} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Clock style={{ width: '12px', height: '12px', color: 'rgba(200,146,42,0.5)' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{repas.moment}</span>
                        {repas.tag && <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', backgroundColor: 'rgba(200,146,42,0.12)', border: '1px solid rgba(200,146,42,0.25)', borderRadius: '2px', color: GOLD, letterSpacing: '0.05em' }}>{repas.tag}</span>}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{repas.nom}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{repas.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: GOLD }}>{repas.macros.kcal}</div>
                        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>kcal</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: GOLD_LIGHT }}>{repas.macros.proteines}g</div>
                        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>prot.</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem 1.5rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem' }}>Ingrédients</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {repas.ingredients.map((ing, ingIdx) => (
                        <span key={ingIdx} style={{ fontSize: '0.72rem', padding: '3px 8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: 'rgba(255,255,255,0.55)' }}>{ing}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Glucides : <strong style={{ color: '#6BCB77' }}>{repas.macros.glucides}g</strong></span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Lipides : <strong style={{ color: '#4DA8FF' }}>{repas.macros.lipides}g</strong></span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Préparation : <strong style={{ color: 'rgba(255,255,255,0.5)' }}>{repas.prep}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
