'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
type ProgressEntry = { id:string; date:string; weight_kg:number|null; body_fat_percent:number|null; muscle_mass_kg:number|null; energy_level:number|null; sleep_hours:number|null; sleep_quality:number|null; stress_level:number|null; workout_completed:boolean; notes:string|null; };
const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
  { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/account', label: 'Compte', icon: '👤' },
];
const emptyForm = { date: new Date().toISOString().split('T')[0], weight_kg:'', body_fat_percent:'', muscle_mass_kg:'', energy_level:'', sleep_hours:'', sleep_quality:'', stress_level:'', workout_completed:false, notes:'' };
export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState<string|null>(null);
  useEffect(()=>{ loadEntries(); },[]);
  async function loadEntries() {
    const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
    const{data}=await supabase.from('progress_tracking').select('*').eq('user_id',user.id).order('date',{ascending:false}).limit(30);
    setEntries(data||[]); setLoading(false);
  }
  async function saveEntry(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
    const payload={user_id:user.id,date:form.date,weight_kg:form.weight_kg?parseFloat(form.weight_kg):null,body_fat_percent:form.body_fat_percent?parseFloat(form.body_fat_percent):null,muscle_mass_kg:form.muscle_mass_kg?parseFloat(form.muscle_mass_kg):null,energy_level:form.energy_level?parseInt(form.energy_level):null,sleep_hours:form.sleep_hours?parseFloat(form.sleep_hours):null,sleep_quality:form.sleep_quality?parseInt(form.sleep_quality):null,stress_level:form.stress_level?parseInt(form.stress_level):null,workout_completed:form.workout_completed,notes:form.notes||null};
    const{error}=await supabase.from('progress_tracking').insert(payload);
    if(error){setMsg('Erreur lors de la sauvegarde.');}else{setMsg('Entrée sauvegardée !');setForm(emptyForm);setShowForm(false);loadEntries();}
    setSaving(false);
  }
  async function deleteEntry(id:string){
    if(!confirm('Supprimer cette entrée ?'))return;
    const supabase=createClient(); await supabase.from('progress_tracking').delete().eq('id',id); loadEntries();
  }
  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'white' };
  const latest = entries[0];
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
          {NAV.map(item=>(<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.href==='/dashboard/progress'?'bg-purple-500/10 text-purple-400':'text-slate-400 hover:text-white hover:bg-white/5'}`}><span>{item.icon}</span>{item.label}</Link>))}
        </nav>
      </aside>
      <main className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between" style={{background:'rgba(9,9,15,0.95)',backdropFilter:'blur(12px)',borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-sm font-black">R</span></Link>
            <div><h1 className="text-white font-bold">Ma Progression</h1><p className="text-slate-500 text-xs">{entries.length} entrée(s)</p></div>
          </div>
          <button onClick={()=>setShowForm(!showForm)} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105" style={{background:showForm?'rgba(255,255,255,0.08)':'linear-gradient(135deg,#059669,#10b981)',boxShadow:showForm?'none':'0 4px 16px rgba(16,185,129,0.2)'}}>{showForm?'✕ Fermer':'+ Nouvelle entrée'}</button>
        </header>
        <div className="px-6 py-8 max-w-5xl mx-auto">
          {msg&&<div className={`p-4 rounded-xl mb-6 text-sm ${msg.includes('Erreur')?'text-red-400':'text-emerald-400'}`} style={msg.includes('Erreur')?{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}:{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.15)'}}>{msg}</div>}
          {/* Formulaire */}
          {showForm&&(
            <form onSubmit={saveEntry} className="rounded-2xl p-6 mb-8" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(16,185,129,0.2)'}}>
              <h3 className="font-bold text-white text-lg mb-6">Nouvelle entrée</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {label:'Date',key:'date',type:'date'},
                  {label:'Poids (kg)',key:'weight_kg',type:'number',step:'0.1',placeholder:'75.5'},
                  {label:'% Masse grasse',key:'body_fat_percent',type:'number',step:'0.1',placeholder:'18.5'},
                  {label:'Masse musculaire (kg)',key:'muscle_mass_kg',type:'number',step:'0.1',placeholder:'35.0'},
                  {label:'Énergie (1-10)',key:'energy_level',type:'number',min:'1',max:'10',placeholder:'7'},
                  {label:'Heures de sommeil',key:'sleep_hours',type:'number',step:'0.5',min:'0',max:'24',placeholder:'7.5'},
                  {label:'Qualité sommeil (1-10)',key:'sleep_quality',type:'number',min:'1',max:'10',placeholder:'8'},
                  {label:'Stress (1-10)',key:'stress_level',type:'number',min:'1',max:'10',placeholder:'3'},
                ].map(field=>(
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{field.label}</label>
                    <input type={field.type} step={(field as {step?:string}).step} min={(field as {min?:string}).min} max={(field as {max?:string}).max} placeholder={(field as {placeholder?:string}).placeholder}
                      value={(form as Record<string,string|boolean>)[field.key] as string}
                      onChange={e=>setForm({...form,[field.key]:field.type==='date'?e.target.value:e.target.value})}
                      required={field.key==='date'}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input type="checkbox" id="wc" checked={form.workout_completed} onChange={e=>setForm({...form,workout_completed:e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                <label htmlFor="wc" className="text-sm text-slate-400">Séance d&apos;entraînement complétée</label>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Notes</label>
                <textarea placeholder="Comment tu te sens..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none" style={inputStyle} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={saving} className="px-6 py-3 font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}>{saving?'Sauvegarde...':'Enregistrer'}</button>
                <button type="button" onClick={()=>setShowForm(false)} className="px-6 py-3 text-slate-400 rounded-xl transition-all hover:text-white" style={{background:'rgba(255,255,255,0.05)'}}>Annuler</button>
              </div>
            </form>
          )}
          {/* Stats rapides */}
          {latest&&!showForm&&(
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {latest.weight_kg&&<div className="rounded-2xl p-4 text-center" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}><div className="text-2xl font-black text-white">{latest.weight_kg}</div><div className="text-xs text-slate-500 mt-1">⚖️ kg</div></div>}
              {latest.energy_level&&<div className="rounded-2xl p-4 text-center" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}><div className="text-2xl font-black text-emerald-400">{latest.energy_level}/10</div><div className="text-xs text-slate-500 mt-1">⚡ Énergie</div></div>}
              {latest.sleep_hours&&<div className="rounded-2xl p-4 text-center" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}><div className="text-2xl font-black text-blue-400">{latest.sleep_hours}h</div><div className="text-xs text-slate-500 mt-1">😴 Sommeil</div></div>}
              {latest.stress_level&&<div className="rounded-2xl p-4 text-center" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}><div className="text-2xl font-black text-amber-400">{latest.stress_level}/10</div><div className="text-xs text-slate-500 mt-1">🧘 Stress</div></div>}
            </div>
          )}
          {loading?<div className="text-center py-20 text-slate-600">Chargement...</div>
          :entries.length===0?(
            <div className="text-center py-20 rounded-2xl" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="text-6xl mb-4">📈</div>
              <h3 className="font-bold text-white text-xl mb-2">Commence à suivre ta progression</h3>
              <p className="text-slate-500 text-sm mb-6">Poids, énergie, sommeil, stress — visualise tes progrès</p>
              <button onClick={()=>setShowForm(true)} className="px-6 py-3 font-semibold text-white rounded-xl transition-all hover:scale-105" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}>+ Première entrée</button>
            </div>
          ):(
            <div className="space-y-3">
              {entries.map(entry=>(
                <div key={entry.id} className="rounded-2xl p-5" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{new Date(entry.date).toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</h3>
                      {entry.workout_completed&&<span className="text-xs text-emerald-400">✅ Séance complétée</span>}
                    </div>
                    <button onClick={()=>deleteEntry(entry.id)} className="text-slate-600 hover:text-red-400 transition-colors">✕</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {entry.weight_kg&&<div><div className="text-xs text-slate-500 mb-0.5">⚖️ Poids</div><div className="text-sm font-semibold text-white">{entry.weight_kg} kg</div></div>}
                    {entry.body_fat_percent&&<div><div className="text-xs text-slate-500 mb-0.5">🔵 Masse grasse</div><div className="text-sm font-semibold text-white">{entry.body_fat_percent}%</div></div>}
                    {entry.energy_level&&<div><div className="text-xs text-slate-500 mb-0.5">⚡ Énergie</div><div className="text-sm font-semibold text-emerald-400">{entry.energy_level}/10</div></div>}
                    {entry.sleep_hours&&<div><div className="text-xs text-slate-500 mb-0.5">😴 Sommeil</div><div className="text-sm font-semibold text-blue-400">{entry.sleep_hours}h</div></div>}
                  </div>
                  {entry.notes&&<p className="text-xs text-slate-500 mt-3 italic">&ldquo;{entry.notes}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
