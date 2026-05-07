'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, Zap, Shield, Brain, Dumbbell, Apple, Leaf, Star, ArrowRight, Smartphone, Loader2 } from 'lucide-react';
h
type PlanKey = 'starter' | 'pro' | 'equipe';

const features = [
  {icon: Brain, title: 'Coach IA Personnalisé', desc: 'Ton programme s’adapte en temps réel à tes objectifs, ton niveau et tes préférences grâce à l’IA.'},
  {icon: Dumbbell, title: 'Programmes Entraînement', desc: 'Des séances générées automatiquement : musculation, cardio, HIIT, mobilité à la maison ou en salle.'},
  {icon: Apple, title: 'Plans Nutritionnels', desc: 'Menus hebdomadaires équilibrés avec macros calculés selon ton profil et tes restrictions alimentaires.'},
  {icon: Leaf, title: 'Suivi de Progression', desc: 'Visualise tes gains, ta charge d’entraînement et tes tendances nutritionnelles semaine après semaine.'},
  {icon: Smartphone, title: 'App Mobile iOS & Android', desc: 'Accède à tout depuis ton téléphone. Mode hors-ligne disponible pour t’entraîner n’importe où.'},
  {icon: Shield, title: 'Données 100 % RGPD', desc: 'Hébergement en Europe, chiffrement de bout en bout. Tes données t’appartiennent.'},
];

const plans = [
  {
    key: 'starter' as PlanKey,
    name: 'Starter',
    price: '29',
    period: 'mois',
    desc: 'Pour démarrer votre transformation',
    features: ['IA Coach 2h/jour', 'Programmes sport de base', 'Plans nutritionnels simples', 'Suivi progression basique', 'App mobile incluse'],
    highlight: false,
  },
  {
    key: 'pro' as PlanKey,
    name: 'Pro',
    price: '99',
    period: 'mois',
    desc: 'Pour les passionés qui veulent des résultats',
    features: ['IA Coach illimitée 24h/24', 'Programmes sport personnalisés', 'Plans nutritionnels adaptés', 'Suivi progression avancé', 'Support prioritaire'],
    highlight: true,
    badge: 'Populaire',
  },
  {
    key: 'equipe' as PlanKey,
    name: 'Équipe',
    price: '149',
    period: 'mois',
    desc: 'Pour les coachs et équipes sportives',
    features: ['Tout le forfait Pro', 'Tableau de bord coach', 'Suivi équipe en temps réel', 'Rapports de performance', 'Support dédié 24h/24'],
    highlight: false,
  },
];

const testimonials = [
  {name: 'Sophie M.', role: 'Coureuse amateur', avatar: 'SM', text: 'En 3 mois avec RegenX, j’ai amélioré mon 10km de 8 minutes. Le coach IA ajuste mes séances chaque semaine.', stars: 5},
  {name: 'Thomas K.', role: 'Coach fitness', avatar: 'TK', text: 'J’utilise RegenX pour créer les programmes de mes 6 clients. Gain de temps énorme et résultats au rendez-vous.', stars: 5},
  {name: 'Camille D.', role: 'Prise de masse', avatar: 'CD', text: '+4 kg de muscle en 4 mois. Le plan nutritionnel est précis et les recettes sont vraiment bonnes.', stars: 5},
];

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        router.push('/register?plan=' + plan);
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erreur lors de la création de la session.');
    } catch {
      alert('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo RengenX.png" alt="RegenX" width={36} height={36} className="rounded-lg object-contain" />
              <span className="text-xl font-black tracking-tight">RegenX</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
              <a href="#pricing" className="hover:text-white transition">Tarifs</a>
              <a href="#testimonials" className="hover:text-white transition">Témoignages</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition px-3 py-2">Connexion</Link>
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={loading !== null}
                className="text-sm bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
              >
                {loading === 'pro' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                S’abonner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5" />
            Propulsé par IA — Conforme RGPD — Made in EU
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Ton coach fitness <br />
            <span className="text-emerald-400">100 % personnalisé</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            RegenX génère tes programmes d’entraînement et tes plans nutritionnels sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => handleSubscribe('pro')}
              disabled={loading !== null}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              {loading === 'pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              Commencer maintenant
            </button>
            <Link href="#features" className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-slate-300 font-semibold px-8 py-4 rounded-xl text-lg transition">
              Voir les fonctionnalités
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {['Remboursé si rétractation sous 14 jours', 'Résiliable à tout moment', 'Conforme RGPD'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-12 text-center">
          {[['2 000+', 'Athlètes actifs'], ['98 %', 'Taux de satisfaction'], ['4,9/5', 'Note moyenne'], ['EU', 'Hébergement']].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-black text-emerald-400">{n}</div>
              <div className="text-sm text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Tout ce dont tu as besoin</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Une plateforme complète pour transformer ton corps.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-emerald-500/30">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Ils ont transformé leur corps</h2>
            <p className="text-slate-400 text-lg">Des résultats réels, de vrais utilisateurs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({length: t.stars}).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Simple &amp; transparent</h2>
            <p className="text-slate-400 text-lg">Choisissez le plan adapté à vos objectifs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={'relative rounded-2xl p-7 border transition-all duration-200 ' + (p.highlight ? 'bg-emerald-600/10 border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-2xl' : 'bg-white/3 border-white/8')}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">{p.badge}</div>
                )}
                <div className="mb-4">
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-slate-400 text-sm">{p.desc}</div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black">{p.price}€</span>
                  <span className="text-slate-400 text-sm ml-1">/{p.period}</span>
                </div>
                <ul className="space-y-2 mb-7">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(p.key)}
                  disabled={loading !== null}
                  className={'flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-xl transition ' + (p.highlight ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white' : 'bg-white/8 hover:bg-white/12 disabled:opacity-50 text-white border border-white/10')}
                >
                  {loading === p.key ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  S’abonner
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-8">
            Tous les prix incluent la TVA — Résiliable à tout moment — Remboursé si rétractation sous 14 jours — Conforme RGPD
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/20 rounded-3xl p-12">
            <h2 className="text-4xl font-black mb-4">Prêt à commencer ?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Rejoins les 2 000+ athlètes qui ont transformé leur corps avec RegenX.<br />
              Remboursé si rétractation dans les 14 jours suivant l’abonnement.
            </p>
            <button
              onClick={() => handleSubscribe('pro')}
              disabled={loading !== null}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold px-10 py-4 rounded-xl text-lg transition"
            >
              {loading === 'pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              S’abonner maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src="/logo RengenX.png" alt="RegenX" width={28} height={28} className="rounded-lg object-contain" />
              <span className="font-black">RegenX</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <Link href="/terms" className="hover:text-white transition">CGU</Link>
              <Link href="/privacy" className="hover:text-white transition">Confidentialité</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
            <p className="text-xs text-slate-600">© 2026 RegenX SAS — Hébergé en EU — Conforme RGPD</p>
          </div>
        </div>
      </footer>
    </main>
  );
                  }
