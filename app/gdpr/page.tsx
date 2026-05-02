'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Download, Trash2, AlertTriangle } from 'lucide-react';

export default function GDPRPage() {
  const [deleting, setDeleting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    const res = await fetch('/api/gdpr');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regenx-mes-donnees.json';
    a.click();
    setExported(true);
  };

  const handleDelete = async () => {
    if (!confirm('Etes-vous sur de vouloir supprimer definitivement votre compte? Cette action est irreversible.')) return;
    setDeleting(true);
    await fetch('/api/gdpr', { method: 'DELETE' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-green-400 hover:text-green-300 mb-8 inline-block">
          Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-4">Mes droits RGPD</h1>
        <p className="text-gray-400 mb-10">Gerez vos donnees personnelles</p>
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-6 h-6 text-green-400" />
              <h2 className="font-semibold text-lg">Exporter mes donnees</h2>
            </div>
            <button onClick={handleExport} className="bg-green-500 text-white px-6 py-2.5 rounded-lg">
              {exported ? 'Telecharge!' : 'Telecharger'}
            </button>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trash2 className="w-6 h-6 text-red-400" />
              <h2 className="font-semibold text-lg text-red-400">Supprimer mon compte</h2>
            </div>
            <button onClick={handleDelete} disabled={deleting} className="bg-red-500 text-white px-6 py-2.5 rounded-lg">
              {deleting ? 'Suppression...' : 'Supprimer mon compte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
