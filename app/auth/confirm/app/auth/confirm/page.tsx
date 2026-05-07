'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-white"
      style={{ background: 'linear-gradient(135deg, #09090f 0%, #0d0d1a 60%, #09090f 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Image
              src="/logo RengenX.png"
              alt="RegenX"
              width={64}
              height={64}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Success icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
              border: '1px solid rgba(16,185,129,0.3)',
              boxShadow: '0 0 40px rgba(16,185,129,0.15)',
            }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">Bienvenue chez RegenX</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black mb-3">
            Compte créé !
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Un email de confirmation a été envoyé
            {email && <> à <span className="text-white font-semibold">{email}</span></>}.
            <br />
            Clique sur le lien dans l’email pour activer ton compte.
          </p>

          {/* Email illustration */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl mb-8 text-left"
            style={{
              backgroundColor: 'rgba(16,185,129,0.05)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-0.5">Vérifie ta boîte mail</div>
              <div className="text-xs text-slate-500">
                Pense à vérifier les spams si tu ne vois pas l’email.
              </div>
            </div>
          </div>

          {/* CTA Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl transition-all text-white mb-4"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 0 20px rgba(16,185,129,0.2)',
            }}
          >
            <ArrowRight className="w-4 h-4" />
            Aller à la connexion
          </Link>

          <Link
            href="/"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Retour à l’accueil
          </Link>
        </div>

        {/* Steps */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { step: '1', label: 'Compte créé', done: true },
            { step: '2', label: 'Email confirmé', done: false },
            { step: '3', label: 'C’est parti !', done: false },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-2"
                style={item.done ? { backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7' } : { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
              >
                {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
              </div>
              <div className={item.done ? 'text-xs font-semibold text-emerald-400' : 'text-xs text-slate-600'}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
