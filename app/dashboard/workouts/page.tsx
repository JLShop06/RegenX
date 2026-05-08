import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, LogOut, ChevronRight, Zap, Crown, Play, CheckCircle, Lock, Calendar, Target, Flame } from 'lucide-react';

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

type Exercice = { nom: string; series: string; repos: string; note?: string };
type Seance = { jour: string; nom: string; exercices: Exercice[] };
type PhaseProg = { titre: string; type: 'salle' | 'exterieur'; seances: Seance[] };

const programme: Record<number, PhaseProg> = {
  1: {
    titre: 'Fondations',
    type: 'salle',
    seances: [
      { jour: 'Lundi', nom: 'Push — Poitrine & Épaules', exercices: [
        { nom: 'Développé couché barre', series: '4×8', repos: '90s', note: 'Charge modérée, focus technique' },
        { nom: 'Développé incliné haltères', series: '3×10', repos: '75s' },
        { nom: 'Élévations latérales', series: '3×15', repos: '60s' },
        { nom: 'Pompes larges', series: '3×12', repos: '60s' },
        { nom: 'Face pulls câble', series: '3×15', repos: '60s', note: 'Haute poulie' },
      ]},
      { jour: 'Mardi', nom: 'Pull — Dos & Biceps', exercices: [
        { nom: 'Tractions pronation', series: '4×6', repos: '90s', note: 'Assistées si besoin' },
        { nom: 'Rowing barre', series: '4×8', repos: '90s' },
        { nom: 'Tirage poitrine câble', series: '3×12', repos: '60s' },
        { nom: 'Curl barre', series: '3×10', repos: '60s' },
        { nom: 'Curl marteau', series: '3×12', repos: '60s' },
      ]},
      { jour: 'Jeudi', nom: 'Jambes — Quadriceps & Fessiers', exercices: [
        { nom: 'Squat barre', series: '5×5', repos: '120s', note: '70% du max' },
        { nom: 'Presse à cuisses', series: '4×10', repos: '90s' },
        { nom: 'Fentes marchées', series: '3×12', repos: '75s' },
        { nom: 'Extension quadriceps', series: '3×15', repos: '60s' },
        { nom: 'Mollets debout', series: '4×20', repos: '45s' },
      ]},
      { jour: 'Vendredi', nom: 'Full Body — Force & Gainage', exercices: [
        { nom: 'Soulevé de terre', series: '4×5', repos: '120s', note: 'Priorité à la forme' },
        { nom: 'Développé militaire', series: '3×8', repos: '90s' },
        { nom: 'Rowing unilatéral haltère', series: '3×10', repos: '75s' },
        { nom: 'Gainage planche', series: '3×45s', repos: '45s' },
        { nom: 'Russian twist', series: '3×20', repos: '45s' },
      ]},
    ],
  },
  2: {
    titre: 'Progression',
    type: 'salle',
    seances: [
      { jour: 'Lundi', nom: 'Push — Volume +10%', exercices: [
        { nom: 'Développé couché barre', series: '4×10', repos: '90s', note: '+2.5kg vs S1' },
        { nom: 'Développé incliné haltères', series: '4×10', repos: '75s' },
        { nom: 'Élévations latérales', series: '4×15', repos: '60s' },
        { nom: 'Dips lestés', series: '3×8', repos: '90s' },
        { nom: 'Écartés câble', series: '3×15', repos: '60s' },
      ]},
      { jour: 'Mardi', nom: 'Pull — Volume +10%', exercices: [
        { nom: 'Tractions pronation', series: '4×8', repos: '90s' },
        { nom: 'Rowing barre', series: '4×10', repos: '90s', note: '+2.5kg vs S1' },
        { nom: 'Tirage poitrine câble', series: '4×12', repos: '60s' },
        { nom: 'Curl barre', series: '4×10', repos: '60s' },
        { nom: 'Curl concentré', series: '3×12', repos: '60s' },
      ]},
      { jour: 'Jeudi', nom: 'Jambes — Volume +10%', exercices: [
        { nom: 'Squat barre', series: '5×6', repos: '120s', note: '+5kg vs S1' },
        { nom: 'Presse à cuisses', series: '4×12', repos: '90s' },
        { nom: 'Fentes bulgares', series: '3×10', repos: '75s' },
        { nom: 'Leg curl couché', series: '3×15', repos: '60s' },
        { nom: 'Mollets assis', series: '4×20', repos: '45s' },
      ]},
      { jour: 'Vendredi', nom: 'Full Body — Intensité', exercices: [
        { nom: 'Soulevé de terre', series: '4×6', repos: '120s', note: '+5kg vs S1' },
        { nom: 'Développé militaire', series: '3×10', repos: '90s' },
        { nom: 'Pull-over câble', series: '3×12', repos: '75s' },
        { nom: 'Gainage latéral', series: '3×40s', repos: '45s' },
        { nom: 'Ab wheel', series: '3×12', repos: '60s' },
      ]},
    ],
  },
  3: {
    titre: 'Intensification',
    type: 'salle',
    seances: [
      { jour: 'Lundi', nom: 'Push — Lourd', exercices: [
        { nom: 'Développé couché barre', series: '5×5', repos: '120s', note: '80% du max' },
        { nom: 'Développé incliné barre', series: '4×8', repos: '90s' },
        { nom: 'Dips lestés', series: '4×8', repos: '90s' },
        { nom: 'Élévations lat + frontales', series: '3×12', repos: '60s' },
        { nom: 'Triceps corde', series: '3×15', repos: '60s' },
      ]},
      { jour: 'Mardi', nom: 'Pull — Lourd', exercices: [
        { nom: 'Tractions supination lestées', series: '4×6', repos: '90s' },
        { nom: 'Rowing barre penché', series: '5×5', repos: '120s', note: '80% du max' },
        { nom: 'Rowing câble', series: '3×12', repos: '75s' },
        { nom: 'Curl barre EZ', series: '4×8', repos: '75s' },
        { nom: 'Curl incliné haltères', series: '3×10', repos: '60s' },
      ]},
      { jour: 'Jeudi', nom: 'Jambes — Lourd', exercices: [
        { nom: 'Squat barre', series: '5×5', repos: '150s', note: '85% du max' },
        { nom: 'Soulevé de terre jambes tendues', series: '4×8', repos: '90s' },
        { nom: 'Hack squat', series: '3×10', repos: '90s' },
        { nom: 'Leg press pieds hauts', series: '3×12', repos: '75s' },
        { nom: 'Mollets à la machine', series: '5×20', repos: '45s' },
      ]},
      { jour: 'Vendredi', nom: 'Full Body — Puissance', exercices: [
        { nom: 'Soulevé de terre compétition', series: '3×3', repos: '180s', note: '90% du max' },
        { nom: 'Développé militaire', series: '4×6', repos: '120s' },
        { nom: 'Tractions', series: '3×max', repos: '90s' },
        { nom: 'Planche chargée', series: '3×60s', repos: '60s' },
        { nom: 'Gainage dynamique', series: '3×20', repos: '45s' },
      ]},
    ],
  },
};

const programmeExt: Record<number, PhaseProg> = {
  1: {
    titre: 'Fondations Corps Libre',
    type: 'exterieur',
    seances: [
      { jour: 'Lundi', nom: 'Haut du corps — Push', exercices: [
        { nom: 'Pompes classiques', series: '4×12', repos: '60s', note: 'Serrer les omoplates' },
        { nom: 'Pompes diamant', series: '3×10', repos: '75s' },
        { nom: 'Pompes déclinées (pieds surélevés)', series: '3×10', repos: '75s' },
        { nom: 'Dips sur banc', series: '3×12', repos: '60s' },
        { nom: 'Pike push-ups', series: '3×10', repos: '60s' },
      ]},
      { jour: 'Mardi', nom: 'Haut du corps — Pull', exercices: [
        { nom: 'Tractions (barre parc ou porte)', series: '4×6', repos: '90s', note: 'Assistées si besoin' },
        { nom: 'Rowing avec serviette', series: '4×10', repos: '75s' },
        { nom: 'Superman dorsal', series: '3×15', repos: '60s' },
        { nom: 'Curl avec sac lesté', series: '3×12', repos: '60s' },
        { nom: 'Rétraction scapulaire', series: '3×20', repos: '45s' },
      ]},
      { jour: 'Jeudi', nom: 'Bas du corps', exercices: [
        { nom: 'Squat poids de corps', series: '5×20', repos: '60s' },
        { nom: 'Fentes marchées', series: '3×12', repos: '60s' },
        { nom: 'Pont fessier', series: '4×20', repos: '45s' },
        { nom: 'Step-ups sur banc', series: '3×12', repos: '60s' },
        { nom: 'Mollets unipodaux', series: '4×20', repos: '45s' },
      ]},
      { jour: 'Samedi', nom: 'HIIT & Core', exercices: [
        { nom: 'Burpees', series: '5×10', repos: '60s' },
        { nom: 'Mountain climbers', series: '3×30s', repos: '45s' },
        { nom: 'Jump squats', series: '3×15', repos: '60s' },
        { nom: 'Planche', series: '4×45s', repos: '45s' },
        { nom: 'Crunchs vélo', series: '3×20', repos: '45s' },
      ]},
    ],
  },
  2: {
    titre: 'Progression Corps Libre',
    type: 'exterieur',
    seances: [
      { jour: 'Lundi', nom: 'Push Avancé', exercices: [
        { nom: 'Pompes archer', series: '4×8', repos: '75s', note: 'Vers objectif pompe unibras' },
        { nom: 'Pompes avec pause basse', series: '3×8', repos: '75s' },
        { nom: 'Dips sur barre basse', series: '4×10', repos: '75s' },
        { nom: 'Pompes pliométriques', series: '3×8', repos: '90s' },
        { nom: 'Pompes déclinées 45°', series: '3×12', repos: '60s' },
      ]},
      { jour: 'Mardi', nom: 'Pull Avancé', exercices: [
        { nom: 'Tractions pronation', series: '4×8', repos: '90s' },
        { nom: 'Tractions australiennes', series: '4×12', repos: '75s' },
        { nom: 'L-sit row (basse barre)', series: '3×10', repos: '75s' },
        { nom: 'Curl isométrique (serviette)', series: '3×45s', repos: '60s' },
        { nom: 'Face pull élastique', series: '3×15', repos: '60s' },
      ]},
      { jour: 'Jeudi', nom: 'Jambes Puissance', exercices: [
        { nom: 'Pistol squat assisté', series: '4×8', repos: '75s', note: 'Main sur barre pour équilibre' },
        { nom: 'Jump squats', series: '4×12', repos: '75s' },
        { nom: 'Nordic curl (si partenaire)', series: '3×5', repos: '90s' },
        { nom: 'Fentes sautées', series: '3×10', repos: '75s' },
        { nom: 'Mollets sautés', series: '3×20', repos: '45s' },
      ]},
      { jour: 'Samedi', nom: 'Circuit Endurance', exercices: [
        { nom: 'Sprint 30m', series: '6×30m', repos: '60s' },
        { nom: 'Burpee pull-up', series: '4×8', repos: '90s' },
        { nom: 'Mountain climbers rapides', series: '4×30s', repos: '45s' },
        { nom: 'Planche à roulette', series: '3×10', repos: '60s' },
        { nom: 'Dragon flag (progression)', series: '3×6', repos: '75s' },
      ]},
    ],
  },
  3: {
    titre: 'Maîtrise Calisthenics',
    type: 'exterieur',
    seances: [
      { jour: 'Lundi', nom: 'Push Elite', exercices: [
        { nom: 'Pompes unibras assistées', series: '4×5', repos: '90s' },
        { nom: 'Pseudo-planche push-ups', series: '3×8', repos: '90s' },
        { nom: 'Dips basse barre lestés', series: '4×8', repos: '90s' },
        { nom: 'Handstand wall hold', series: '3×30s', repos: '60s' },
        { nom: 'Pompes plio avec clap', series: '3×8', repos: '90s' },
      ]},
      { jour: 'Mardi', nom: 'Pull Elite', exercices: [
        { nom: 'Tractions lestées', series: '5×5', repos: '90s' },
        { nom: 'Muscle-up négatifs', series: '4×4', repos: '120s' },
        { nom: 'Front lever progressif', series: '4×20s', repos: '90s' },
        { nom: 'Tractions supination lentes', series: '3×6', repos: '75s' },
        { nom: 'L-sit tenu', series: '3×20s', repos: '60s' },
      ]},
      { jour: 'Jeudi', nom: 'Jambes Elite', exercices: [
        { nom: 'Pistol squat complet', series: '4×6', repos: '75s' },
        { nom: 'Box jump haut', series: '4×6', repos: '90s' },
        { nom: 'Nordic curl complet', series: '3×6', repos: '120s' },
        { nom: 'Fentes sautées lestées', series: '3×12', repos: '75s' },
        { nom: 'Mollets unipodaux lestés', series: '4×20', repos: '45s' },
      ]},
      { jour: 'Samedi', nom: 'Skill & Cardio', exercices: [
        { nom: 'Handstand (équilibre libre)', series: '5×tentatives', repos: '60s' },
        { nom: 'Muscle-up pratique', series: '5×3', repos: '120s' },
        { nom: 'Sprint côte 60m', series: '6×60m', repos: '90s' },
        { nom: 'Human flag progressif', series: '3×15s', repos: '90s' },
        { nom: 'Planche avancée', series: '3×60s', repos: '60s' },
      ]},
    ],
  },
};

export default async function WorkoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const createdAt = new Date(user.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  const currentWeek = Math.min(Math.max(diffWeeks + 1, 1), 12);
  const phase = Math.min(Math.ceil(currentWeek / 3), 3) as 1 | 2 | 3;
  const weekInPhase = ((currentWeek - 1) % 3) + 1;

  const planType = user.user_metadata?.plan_type || 'salle';
  const isExterieur = planType === 'exterieur' || planType === 'outdoor';
  const currentProg = isExterieur ? programmeExt[phase] : programme[phase];
  const progressPct = Math.round((currentWeek / 12) * 100);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      <aside style={{ width: '240px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.12)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(200,146,42,0.1)' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '3px', textDecoration: 'none', color: item.href === '/dashboard/workouts' ? GOLD : 'rgba(255,255,255,0.45)', backgroundColor: item.href === '/dashboard/workouts' ? 'rgba(200,146,42,0.08)' : 'transparent', fontSize: '0.82rem', fontWeight: item.href === '/dashboard/workouts' ? 600 : 400, letterSpacing: '0.02em', borderLeft: item.href === '/dashboard/workouts' ? '2px solid ' + GOLD : '2px solid transparent' }}>
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
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>★ Programme Personnalisé</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Entraînements</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Programme {isExterieur ? 'extérieur & calisthenics' : 'musculation en salle'} — Semaine {currentWeek}/12</p>
        </div>

        <div style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ width: '16px', height: '16px', color: GOLD }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: GOLD }}>Semaine {currentWeek} — Phase {phase} : {currentProg.titre}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{progressPct}% du programme</span>
          </div>
          <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
            <div style={{ height: '100%', width: progressPct + '%', background: 'linear-gradient(90deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame style={{ width: '14px', height: '14px', color: GOLD }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>4 séances / semaine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target style={{ width: '14px', height: '14px', color: GOLD }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{isExterieur ? 'Extérieur & Corps libre' : 'Salle de musculation'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Crown style={{ width: '14px', height: '14px', color: GOLD }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Semaine {weekInPhase}/3 de la phase</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentProg.seances.map((seance, idx) => (
            <div key={idx} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(200,146,42,0.06) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell style={{ width: '15px', height: '15px', color: '#0a0a0a' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,146,42,0.7)', marginBottom: '2px' }}>{seance.jour}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{seance.nom}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Play style={{ width: '14px', height: '14px', color: GOLD }} />
                  <span style={{ fontSize: '0.75rem', color: GOLD, fontWeight: 600 }}>{seance.exercices.length} exercices</span>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '0.6rem 1.5rem', textAlign: 'left', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Exercice</th>
                    <th style={{ padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Séries×Reps</th>
                    <th style={{ padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Repos</th>
                    <th style={{ padding: '0.6rem 1.5rem', textAlign: 'left', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Note coach</th>
                  </tr>
                </thead>
                <tbody>
                  {seance.exercices.map((ex, exIdx) => (
                    <tr key={exIdx} style={{ borderBottom: exIdx < seance.exercices.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <CheckCircle style={{ width: '14px', height: '14px', color: 'rgba(200,146,42,0.4)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{ex.nom}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: GOLD, fontFamily: 'monospace' }}>{ex.series}</span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{ex.repos}</span>
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        {ex.note && <span style={{ fontSize: '0.72rem', color: 'rgba(200,146,42,0.6)', fontStyle: 'italic' }}>{ex.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {currentWeek < 12 && (
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
            <Lock style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Les semaines {currentWeek + 1}–12 se débloquent automatiquement au fil de votre progression.</span>
          </div>
        )}
      </main>
    </div>
  );
}
