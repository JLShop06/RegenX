'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Salut ! Je suis ton coach RegenX. Sport, nutrition, récupération : pose-moi tes questions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    setError(null);
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      if (res.status === 402) {
        setError('Abonnement requis. Souscris à RegenX Premium pour accéder au coach IA.');
        setMessages(next); setLoading(false); return;
      }
      if (!res.ok || !res.body) { setError('Erreur serveur'); setLoading(false); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(m => { const c = [...m]; c[c.length-1] = { role:'assistant', content: acc }; return c; });
      }
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-emerald-700">← RegenX</Link>
          <h1 className="font-semibold">Coach IA</h1>
          <Link href="/account" className="text-sm">Compte</Link>
        </div>
      </header>
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${m.role==='user'?'bg-emerald-600 text-white':'bg-white shadow-sm border'}`}>{m.content || (loading && i===messages.length-1 ? '...' : '')}</div>
          </div>
        ))}
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error} <Link href="/pricing" className="underline">Voir l'abonnement</Link></div>}
        <div ref={endRef} />
      </div>
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Pose ta question..." className="flex-1 p-3 border rounded-lg" disabled={loading} />
          <button onClick={send} disabled={loading||!input.trim()} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg">Envoyer</button>
        </div>
      </div>
    </main>
  );
}
