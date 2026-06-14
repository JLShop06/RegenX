'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, Zap, Shield, Brain, Dumbbell, Apple, Leaf, Star, ArrowRight, Smartphone, Loader2 } from 'lucide-react';

type PlanKey = 'starter' | 'pro' | 'equipe';

const features = [
  { icon: Brain, title: 'Coach IA Personnalisé', desc: 'Ton programme s’adapte en temps réel à tes objectifs, ton niveau et tes préférences grâce à l’IA.' },
  { icon: Dumbbell, title: 'Programmes Entraîhnement', desc: 'Des séances générées automatiquement : musculation, cardio, HIIT, mobilité à la maison ou en salle.' },
  { icon: Apple, title: 'Plans Nutritionnels', desc: 'Menus hebdomadaires équilibrés avec macros calculés selon ton profil et tes restrictions alimentaires.' },
  { icon: Leaf, title: 'Suivi de Progression', desc: 'Visualise tes gains, ta charge d’entraînement et tes tendances nutritionnelles semaine après semaine.' },
  { icon: Smartphone, title: 'App Mobile iOS & Android', desc: 'Accède à tout depuis ton téléphone. Mode hors-ligne disponible pour t’entraîner n’importe où.' },
  { icon: Shield, title: 'Données 100 % RGPD', desc: 'Hébergement en Europe, chiffrement de bout en bout. Tes données t’appartiennent.' },
];

const plans = [
  { key: 'starter' as PlanKey, name: 'Starter', price: '29', desc: 'Pour débuter votre transformation', features: ['IA Coach 2h/jour', 'Programmes sport de base', 'Plans nutritionnels simples', 'Suivi progression basique', 'App mobile incluse'], highlight: false },
  { key: 'pro' as PlanKey, name: 'Pro', price: '99', desc: 'L’expérience premium complète', features: ['IA Coach illimitée 24h/24', 'Programmes sport personnalisés', 'Plans nutritionnels adaptés', 'Suivi progression avancé', 'Support prioritaire'], highlight: true, badge: 'Populaire' },
  { key: 'equipe' as PlanKey, name: 'Équipe', price: '149', desc: 'Pour coachs et équipes sportives', features: ['Tout le forfait Pro', 'Tableau de bord coach', 'Suivi équipe en temps réel', 'Rapports de performance', 'Support dédié 24h/24'], highlight: false },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Coureuse amateur', avatar: 'SM', text: 'En 3 mois avec RegenX, j’ai amélioré mon 10km de 8 minutes. Le coach IA ajuste mes séances chaque semaine.', stars: 5 },
  { name: 'Thomas K.', role: 'Coach fitness', avatar: 'TK', text: 'J’utilise RegenX pour créer les programmes de mes 6 clients. Gain de temps énorme et résultats au rendez-vous.', stars: 5 },
  { name: 'Camille D.', role: 'Prise de masse', avatar: 'CD', text: '+4 kg de muscle en 4 mois. Le plan nutritionnel est précis et les recettes sont vraiment bonnes.', stars: 5 },
];

const GOLD = '#C8A85A';
const GOLD_LIGHT = '#E7D3A1';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      if (res.status === 401) { router.push('/register?plan=' + plan); return; }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erreur lors de la création de la session.');
    } catch { alert('Erreur réseau. Veuillez réessayer.'); }
    finally { setLoading(null); }
  }

  return (
    <main style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap');" }} />
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,146,42,0.12)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={64} height={64} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="hidden md:flex">
            {[['#features', 'Fonctionnalités'], ['#pricing', 'Tarifs'], ['#testimonials', 'Témoignages']].map(([h, l]) => (
              <a key={l} href={h} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = GOLD} onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/login" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connexion</Link>
            <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '3px', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            S’abonner
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '9rem', paddingBottom: '6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,146,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Image src="/logo RengenX.webp" alt="RegenX" width={240} height={240} priority style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(200,146,42,0.35))' }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1.05, marginBottom: '1.5rem', color: '#F2E8D2' }}>
            Ton coach fitness
            <br />
            <span style={{ color: GOLD }}>100 % personnalisé</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            RegenX génère tes programmes d’entraînement et tes plans nutritionnels sur mesure.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '1rem 2rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {loading === 'pro' ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <ArrowRight style={{ width: 18, height: 18 }} />} Commencer maintenant
            </button>
            <a href="#features" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(200,146,42,0.3)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, padding: '1rem 2rem', borderRadius: '3px', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Fonctionnalités
            </a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            {['Remboursement 14 jours', 'Sans engagement', 'Conforme RGPD'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle style={{ width: 14, height: 14, color: GOLD }} />{t}</span>
            ))}
          </div>

          {/* Partenaires */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>En partenariat avec</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              <a href="https://www.green-therapy.pt" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', cursor: 'pointer' }}><Image src="/logo-green-therapy.png" alt="Green Therapy" width={180} height={70} style={{ objectFit: 'contain', opacity: 0.9 }} /></a>
              <a href="/boutique.html" title="Découvrir la boutique Eric Favre" style={{ display: 'inline-block', cursor: 'pointer' }}><Image src="/logo-eric-favre.png" alt="Eric Favre" width={160} height={60} style={{ objectFit: 'contain', opacity: 0.85, filter: 'brightness(1.1)', pointerEvents: 'none' }} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid rgba(200,146,42,0.12)', borderBottom: '1px solid rgba(200,146,42,0.12)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', textAlign: 'center' }}>
          {[['2 000+', 'Athlètes actifs'], ['98 %', 'Satisfaction'], ['4,9★', 'Note moyenne'], ['EU', 'Hébergement']].map(([n, l]) => (
            <div key={l}><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 600, color: GOLD, letterSpacing: '0.01em' }}>{n}</div><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Fonctionnalités</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>Tout ce dont tu as besoin</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem', transition: 'border-color 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,146,42,0.25)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(200,146,42,0.1)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <f.icon style={{ width: '18px', height: '18px', color: GOLD }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '6rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Témoignages</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>Ils ont transformé leur corps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: GOLD, color: GOLD }} />)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '34px', height: '34px', backgroundColor: 'rgba(200,146,42,0.2)', border: '1px solid rgba(200,146,42,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: GOLD }}>{t.avatar}</div>
                  <div><div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Tarification</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>Simple & transparent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {plans.map(p => (
              <div key={p.name} style={{ position: 'relative', backgroundColor: p.highlight ? 'rgba(200,146,42,0.05)' : '#111111', border: p.highlight ? '1px solid rgba(200,146,42,0.35)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                {p.badge && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: GOLD, color: '#0a0a0a', fontSize: '0.6rem', fontWeight: 700, padding: '3px 12px', borderRadius: '2px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{p.badge}</div>}
                <div style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>{p.desc}</div>
                <div style={{ marginBottom: '1.5rem' }}><span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 600, letterSpacing: '0.01em', color: p.highlight ? GOLD : '#fff' }}>{p.price}€</span><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginLeft: '4px' }}>/mois</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {p.features.map(feat => (<li key={feat} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', alignItems: 'flex-start' }}><CheckCircle style={{ width: 14, height: 14, color: GOLD, marginTop: '2px', flexShrink: 0 }} />{feat}</li>))}
                </ul>
                <button onClick={() => handleSubscribe(p.key)} disabled={loading !== null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: '3px', cursor: 'pointer', background: p.highlight ? 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')' : 'rgba(255,255,255,0.06)', color: p.highlight ? '#0a0a0a' : 'rgba(255,255,255,0.7)', transition: 'opacity 0.2s' }}>
                  {loading === p.key ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <ArrowRight style={{ width: 14, height: 14 }} />} S’abonner
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '2rem' }}>
            TVA incluse — Sans engagement — Remboursement sous 14 jours — Conforme RGPD
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', backgroundColor: '#111111', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px', padding: '4rem 3rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.5rem' }}>★ Rejoignez l’élite</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2', marginBottom: '1rem' }}>Prêt à commencer ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Rejoins les 2 000+ athlètes qui ont transformé leur corps avec RegenX.
          </p>
          <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '1rem 2.5rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {loading === 'pro' ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <ArrowRight style={{ width: 18, height: 18 }} />} S’abonner maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(200,146,42,0.12)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {[['CGU', '/terms'], ['Confidentialité', '/privacy'], ['Mentions légales', '/mentions-legales'], ['Contact', '/contact']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>© 2026 RegenX — Hébergé en EU — Conforme RGPD</p>
        </div>
      </footer>
    </main>
  );
}
