'use client';
import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6" style={{ background: 'radial-gradient(circle, rgba(200,146,42,0.15), rgba(200,146,42,0.03))', border: '1px solid rgba(200,146,42,0.4)', borderRadius: '50%' }}>
            <CheckCircle className="w-9 h-9" style={{ color: '#C8922A' }} />
          </div>
          <div className="text-xs font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: '#C8922A' }}>Bienvenue</div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Compte créé !</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8' }}>Vérifiez votre email pour activer votre compte.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold" style={{ background: 'linear-gradient(135deg, #C8922A, #E8B84B)', color: '#0a0a0a', borderRadius: '4px', letterSpacing: '0.08em', textDecoration: 'none' }}>
            <ArrowRight className="w-4 h-4" /> SE CONNECTER
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: 'linear-gradient(160deg, #0f0f0f 0%, #151208 60%, #1a1506 100%)', borderRight: '1px solid rgba(200,146,42,0.15)' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo RengenX.png" alt="RegenX" width={80} height={80} className="object-contain" />
        </div>
        <div>
          <div className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#C8922A' }}>★ Club Premium</div>
          <h2 className="text-5xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Rejoignez<br /><span style={{ color: '#C8922A' }}>l’élite.</span>
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: '1.8' }}>
            Coach IA illimité. Programmes sur mesure.<br />Résultats garantis.
          </p>
        </div>
        <div className="flex gap-6">
          {[['Sport', '✔'], ['Nutrition', '✔'], ['Suivi', '✔']].map(([l, v]) => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: '#C8922A' }}>{v}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-10 lg:hidden">
            <Image src="/logo RengenX.png" alt="RegenX" width={96} height={96} className="object-contain" />
          </div>
          <div className="mb-10">
            <div className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#C8922A' }}>Création de compte</div>
            <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Inscription</h1>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com"
                className="w-full px-4 py-3.5 text-white text-sm outline-none transition-all"
                style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', caretColor: '#C8922A' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(200,146,42,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="8 caractères minimum"
                  className="w-full px-4 py-3.5 pr-12 text-white text-sm outline-none transition-all"
                  style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', caretColor: '#C8922A' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(200,146,42,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <div className="px-4 py-3 text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', color: '#fca5a5' }}>{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold tracking-wider transition-all mt-6"
              style={{ background: loading ? 'rgba(200,146,42,0.3)' : 'linear-gradient(135deg, #C8922A, #E8B84B)', color: '#0a0a0a', borderRadius: '4px', letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer', border: 'none' }}>
              {loading ? 'INSCRIPTION...' : (<><ArrowRight className="w-4 h-4" /> CRÉER MON COMPTE</>)}
            </button>
          </form>
          <p className="mt-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Déjà membre ?{' '}<Link href="/login" className="font-semibold" style={{ color: '#C8922A' }}>Se connecter</Link>
          </p>
          <p className="mt-4 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            En créant un compte, vous acceptez nos{' '}<Link href="/terms" style={{ color: 'rgba(200,146,42,0.6)' }}>CGU</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }} />}>
      <RegisterForm />
    </Suspense>
  );
}
