'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
type Msg = { role: 'user' | 'assistant'; content: string };
const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
  { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/account', label: 'Compte', icon: '👤' },
];
export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Salut ! Je suis ton coach RegenX IA. Pose-moi tes questions sur le sport, la nutrition ou la récupération.' }
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
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/coach', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: next }) });
      if (res.status === 402) { setError('Abonnement requis.'); setMessages(next); setLoading(false); return; }
      if (!res.ok || !res.body) { setError('Erreur serveur.'); setLoading(false); return; }
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let acc = '';
      while (true) { const { done, value } = await reader.read(); if (done) break; acc += decoder.decode(value,{stream:true}); setMessages(m=>{const c=[...m];c[c.length-1]={role:'assistant',content:acc};return c;}); }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erreur'); }
    setLoading(false);
  }
  return (
    <div className="min-h-screen flex" style={{background:'#09090f'}}>
      <aside className="fixed top-0 left-0 h-full w-64 border-r flex-col z-20 hidden lg:flex" style={{background:'rgba(255,255,255,0.02)',borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="p-6 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-lg font-black">R</span></div>
            <span className="text-white font-bold text-lg">RegenX</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item=>(<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.href==='/dashboard/coach'?'bg-emerald-500/10 text-emerald-400':'text-slate-400 hover:text-white hover:bg-white/5'}`}><span>{item.icon}</span>{item.label}</Link>))}
        </nav>
      </aside>
      <div className="flex flex-col flex-1 lg:ml-64">
        <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center gap-4" style={{background:'rgba(9,9,15,0.95)',backdropFilter:'blur(12px)',borderColor:'rgba(255,255,255,0.06)'}}>
          <Link href="/dashboard" className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-sm font-black">R</span></Link>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.2)'}}>🤖</div>
          <div><h1 className="text-white font-bold text-sm">Coach IA RegenX</h1><p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span> En ligne</p></div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6" style={{maxHeight:'calc(100vh - 140px)'}}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((m,i)=>(
              <div key={i} className={`flex gap-3 ${m.role==='user'?'justify-end':'justify-start'}`}>
                {m.role==='assistant'&&<div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm mt-1" style={{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.2)'}}>🤖</div>}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role==='user'?'text-white rounded-br-sm':'text-slate-200 rounded-bl-sm'}`}
                  style={m.role==='user'?{background:'linear-gradient(135deg,#059669,#10b981)'}:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}
                >
                  {m.content||(loading&&i===messages.length-1?<span className="flex gap-1 items-center"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span></span>:'')}
                </div>
                {m.role==='user'&&<div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 text-emerald-400" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.15)'}}>T</div>}
              </div>
            ))}
            {error&&<div className="p-4 rounded-xl text-sm text-red-400 flex items-center justify-between gap-4" style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}}><span>{error}</span><Link href="/pricing" className="text-emerald-400 font-semibold text-xs">Abonnement →</Link></div>}
            <div ref={endRef} />
          </div>
        </div>
        <div className="border-t p-4" style={{borderColor:'rgba(255,255,255,0.06)',background:'rgba(9,9,15,0.95)'}}>
          <div className="max-w-3xl mx-auto flex gap-3">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} placeholder="Pose ta question..." disabled={loading}
              className="flex-1 px-4 py-3.5 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all disabled:opacity-50"
              style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}
            />
            <button onClick={send} disabled={loading||!input.trim()} className="px-5 py-3.5 font-bold text-white rounded-2xl transition-all disabled:opacity-40 hover:scale-105"
              style={{background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 16px rgba(16,185,129,0.25)'}}
            >↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
