'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push('/dashboard'); router.refresh(); }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Left panel - decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: 'linear-gradient(160deg, #0f0f0f 0%, #151208 60%, #1a1506 100%)',
          borderRight: '1px solid rgba(200,146,42,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo RengenX.png" alt="RegenX" width={80} height={80} className="object-contain" />
        </div>
        <div>
          <div
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: '#C8922A' }}
          >
            ★ Premium Fitness IA
          </div>
          <h2
            className="text-5xl font-black text-white leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            Ton corps.<br />
            <span style={{ color: '#C8922A' }}>Ta règle.</span>
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: '1.8' }}>
            Coach fitness IA 100 % personnalisé.
            <br />Sport, nutrition, progression. Sans compromis.
          </p>
        </div>
        <div className="flex gap-8">
          {[['2000+', 'Athlètes'], ['98%', 'Satisfaction'], ['4,9★', 'Note']].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-black" style={{ color: '#C8922A' }}>{v}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <Image src="/logo RengenX.png" alt="RegenX" width={96} height={96} className="object-contain" />
          </div>

          <div className="mb-10">
            <div
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: '#C8922A' }}
            >
              Espace membre
            </div>
            <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Connexion
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-3.5 text-white text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  caretColor: '#C8922A',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(200,146,42,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Mot de passe
                </label>
                <Link href="/forgot-password" className="text-xs transition-colors" style={{ color: '#C8922A' }}>
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 text-white text-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    caretColor: '#C8922A',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(200,146,42,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 text-xs"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', color: '#fca5a5' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold tracking-wider transition-all mt-6"
              style={{
                background: loading ? 'rgba(200,146,42,0.3)' : 'linear-gradient(135deg, #C8922A, #E8B84B)',
                color: '#0a0a0a',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'CONNEXION...' : (<><ArrowRight className="w-4 h-4" /> SE CONNECTER</>)}
            </button>
          </form>

          <p className="mt-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Pas encore membre ?{' '}
            <Link href="/register" className="font-semibold" style={{ color: '#C8922A' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
