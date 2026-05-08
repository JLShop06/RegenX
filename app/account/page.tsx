import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, LogOut, Zap, Crown, Shield, FileText, ChevronRight } from 'lucide-react';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const email = user.email || '';
  const firstName = user.user_metadata?.first_name || email.split('@')[0] || 'Athlète';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const createdAt = new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.12)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(200,146,42,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '3px', textDecoration: 'none', color: item.href === '/account' ? GOLD : 'rgba(255,255,255,0.45)', backgroundColor: item.href === '/account' ? 'rgba(200,146,42,0.08)' : 'transparent', fontSize: '0.82rem', fontWeight: item.href === '/account' ? 600 : 400, letterSpacing: '0.02em', borderLeft: item.href === '/account' ? '2px solid ' + GOLD : '2px solid transparent' }}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 0.85rem', borderRadius: '3px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', cursor: 'pointer' }}>
              <LogOut style={{ width: '16px', height: '16px' }} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>★ Espace Membre</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Mon compte</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', maxWidth: '900px' }}>
          {/* Profile card */}
          <div style={{ backgroundColor: '#111111', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px', padding: '2rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>Profil</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 900, color: '#0a0a0a', flexShrink: 0 }}>
                {avatarLetter}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{displayName}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['Membre depuis', createdAt], ['Statut', 'Actif']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{l}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: l === 'Statut' ? '#4ade80' : '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription card */}
          <div style={{ backgroundColor: 'rgba(200,146,42,0.04)', border: '1px solid rgba(200,146,42,0.25)', borderRadius: '4px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Crown style={{ width: '16px', height: '16px', color: GOLD }} />
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Abonnement</div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: GOLD, letterSpacing: '-0.02em' }}>Premium</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Accès illimité — Coach IA 24h/24</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {['Coach IA illimitée', 'Programmes personnalisés', 'Plans nutritionnels', 'Suivi avancé', 'Support prioritaire'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: GOLD, flexShrink: 0 }} />{f}
                </div>
              ))}
            </div>
            <Link href="/pricing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.85rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0a0a0a', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', borderRadius: '3px', textDecoration: 'none' }}>
              Gérer l’abonnement <ChevronRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* Legal */}
          <div style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2rem', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Shield style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.3)' }} />
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Données & confidentialité</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {[['Mentions légales', '/mentions-legales'], ['Politique de confidentialité', '/privacy'], ['CGU', '/terms']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '0.5rem 0.85rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', transition: 'border-color 0.2s' }}>
                  <FileText style={{ width: '13px', height: '13px' }} />{l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
