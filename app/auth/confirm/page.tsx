'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,146,42,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Link href="/">
            <Image src="/logo RengenX.png" alt="RegenX" width={72} height={72} className="object-contain" />
          </Link>
        </div>
        <div className="text-center px-10 py-12" style={{ backgroundColor: '#111111', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8" style={{ background: 'radial-gradient(circle, rgba(200,146,42,0.15), rgba(200,146,42,0.03))', border: '1px solid rgba(200,146,42,0.4)', borderRadius: '50%' }}>
            <CheckCircle className="w-9 h-9" style={{ color: '#C8922A' }} />
          </div>
          <div className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#C8922A' }}>Bienvenue chez RegenX</div>
          <h1 className="text-3xl font-black mb-2 text-white" style={{ letterSpacing: '-0.02em' }}>Compte créé</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7' }}>
            Un email de confirmation a été envoyé{email && <> à <span className="text-white font-medium">{email}</span></>}.
            <br />Cliquez sur le lien pour activer votre compte.
          </p>
          <div className="flex items-center gap-4 p-4 mb-8 text-left" style={{ backgroundColor: 'rgba(200,146,42,0.05)', border: '1px solid rgba(200,146,42,0.15)', borderRadius: '4px' }}>
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9" style={{ backgroundColor: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px' }}>
              <Mail className="w-4 h-4" style={{ color: '#C8922A' }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Vérifiez votre boite mail</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Pensez à vérifier les spams.</div>
            </div>
          </div>
          <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold transition-all" style={{ background: 'linear-gradient(135deg, #C8922A, #E8B84B)', color: '#0a0a0a', borderRadius: '4px', letterSpacing: '0.05em', textDecoration: 'none' }}>
            <ArrowRight className="w-4 h-4" /> ACCÉDER À LA CONNEXION
          </Link>
          <Link href="/" className="block mt-5 text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
            Retour à l’accueil
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[{ label: 'Inscription', done: true }, { label: 'Confirmation', done: false }, { label: 'Accès', done: false }].map((item, idx) => (
            <div key={item.label} className="flex flex-col items-center text-center py-4" style={{ backgroundColor: '#111111', border: item.done ? '1px solid rgba(200,146,42,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
              <div className="w-6 h-6 flex items-center justify-center text-xs font-black mb-2" style={{ backgroundColor: item.done ? 'rgba(200,146,42,0.2)' : 'rgba(255,255,255,0.05)', border: item.done ? '1px solid rgba(200,146,42,0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: item.done ? '#C8922A' : 'rgba(255,255,255,0.3)' }}>
                {item.done ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div className="text-xs font-medium" style={{ color: item.done ? '#C8922A' : 'rgba(255,255,255,0.3)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }} />}>
      <ConfirmContent />
    </Suspense>
  );
}
