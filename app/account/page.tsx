'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
  { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/account', label: 'Compte', icon: '👤' },
];
export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{email?:string;id?:string}|null>(null);
  const [sub, setSub] = useState<{status?:string;stripe_customer_id?:string}|null>(null);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState<{text:string;type:'success'|'error'}|null>(null);
  useEffect(()=>{
    (async()=>{
      const supabase=createClient();
      const{data:{user}}=await supabase.auth.getUser();
      if(!user){router.push('/login');return;}
      setUser(user);
      const{data:s}=await supabase.from('subscriptions').select('*').eq('user_id',user.id).single();
      setSub(s); setLoading(false);
    })();
  },[router]);
  async function logout(){
    const supabase=createClient(); await supabase.auth.signOut(); router.push('/'); router.refresh();
  }
  async function openPortal(){
    setWorking(true); setMsg(null);
    const res=await fetch('/api/stripe/billing-portal',{method:'POST'});
    const json=await res.json();
    if(json.url) window.location.href=json.url;
    else setMsg({text:'Impossible d\'ouvrir le portail.',type:'error'});
    setWorking(false);
  }
  async function exportData(){
    setWorking(true); setMsg(null);
    const res=await fetch('/api/gdpr');
    if(res.ok){
      const blob=await res.blob(); const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download=`regenx-export-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
      setMsg({text:'Données exportées avec succès.',type:'success'});
    } else setMsg({text:'Export échoué.',type:'error'});
    setWorking(false);
  }
  async function deleteAccount(){
    if(!confirm('Supprimer définitivement votre compte ? Cette action est irréversible.'))return;
    if(!confirm('Confirmation finale : toutes vos données seront perdues. Continuer ?'))return;
    setWorking(true);
    const res=await fetch('/api/gdpr',{method:'DELETE'});
    if(res.ok){router.push('/');router.refresh();}
    else setMsg({text:'Suppression échouée.',type:'error'});
    setWorking(false);
  }
  const isActive = sub?.status==='active'||sub?.status==='trialing';
  if(loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#09090f'}}><div className="text-slate-500">Chargement...</div></div>;
  return (
    <div className="min-h-screen" style={{background:'#09090f'}}>
      <aside className="fixed top-0 left-0 h-full w-64 border-r flex-col z-20 hidden lg:flex" style={{background:'rgba(255,255,255,0.02)',borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="p-6 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-lg font-black">R</span></div>
            <span className="text-white font-bold text-lg">RegenX</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item=>(<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.href==='/account'?'bg-white/5 text-white':'text-slate-400 hover:text-white hover:bg-white/5'}`}><span>{item.icon}</span>{item.label}</Link>))}
        </nav>
        <div className="p-4 border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>
      <main className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between" style={{background:'rgba(9,9,15,0.95)',backdropFilter:'blur(12px)',borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-sm font-black">R</span></Link>
            <h1 className="text-white font-bold">Mon compte</h1>
          </div>
          <button onClick={logout} className="lg:hidden text-xs text-slate-500 hover:text-white transition">Déconnexion</button>
        </header>
        <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
          {msg&&(
            <div className={`p-4 rounded-xl text-sm ${msg.type==='error'?'text-red-400':'text-emerald-400'}`}
              style={msg.type==='error'?{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}:{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.15)'}}
            >{msg.text}</div>
          )}
          {/* Profil */}
          <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <h2 className="font-bold text-white mb-4">Profil</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-emerald-400" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.15)'}}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.email}</p>
                <p className="text-slate-500 text-xs mt-0.5">Membre RegenX</p>
              </div>
            </div>
          </div>
          {/* Abonnement */}
          <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Abonnement</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:isActive?'rgba(16,185,129,0.15)':'rgba(100,100,100,0.15)',color:isActive?'#10b981':'#94a3b8',border:isActive?'1px solid rgba(16,185,129,0.25)':'1px solid rgba(100,100,100,0.2)'}}>{isActive?'● Actif':'○ '+(sub?.status||'Inactif')}</span>
            </div>
            <p className="text-slate-500 text-sm mb-5">{isActive?'Ton abonnement RegenX Premium est actif. Accès illimité à toutes les fonctionnalités.':'Passe à Premium pour débloquer le coach IA, les programmes et les plans nutritionnels.'}</p>
            {sub?.stripe_customer_id?(
              <button onClick={openPortal} disabled={working} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}}>Gérer mon abonnement Stripe →</button>
            ):(
              <Link href="/pricing" className="inline-flex px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105" style={{background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 16px rgba(16,185,129,0.2)'}}>Choisir un forfait →</Link>
            )}
          </div>
          {/* RGPD */}
          <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <h2 className="font-bold text-white mb-2">RGPD — Mes données</h2>
            <p className="text-slate-500 text-sm mb-5">Conformément au RGPD, tu peux exporter ou supprimer tes données à tout moment.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={exportData} disabled={working} className="px-5 py-2.5 text-sm font-semibold text-slate-300 rounded-xl transition-all hover:text-white hover:scale-105 disabled:opacity-50" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>📥 Exporter mes données</button>
              <button onClick={deleteAccount} disabled={working} className="px-5 py-2.5 text-sm font-semibold text-red-400 rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}}>🗑 Supprimer mon compte</button>
            </div>
          </div>
          {/* Liens */}
          <div className="flex gap-4 text-xs text-slate-600 pb-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">Politique de confidentialité</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">CGU</Link>
            <Link href="/mentions-legales" className="hover:text-slate-400 transition">Mentions légales</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
