import React, { useState } from 'react';
import { Badge } from '../types';

export default function VaultOfPenguasaan() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    {
      id: 'ling',
      name: 'Ahli Linguistik',
      date: 'Dibuka: Oct 12, 2026',
      desc: 'Dianugerahkan apabila mencapai ketepatan nahu melebihi 92% sepanjang tiga sesi pembentangan kewangan tinggi-risiko berterusan.',
      icon: 'translate',
      locked: false,
      color: 'primary',
    },
    {
      id: 'nav',
      name: 'Pemandu Arah',
      date: 'Dibuka: Nov 05, 2026',
      desc: 'Dianugerahkan kepada pengguna yang cekap menavigasi portfolio kompaun yang kompleks dan pencarian garis masa pelaburan optimum.',
      icon: 'explore',
      locked: false,
      color: 'tertiary',
    },
    {
      id: 'bull',
      name: 'Legenda "Bull"',
      date: 'Dibuka: Dec 20, 2026',
      desc: 'Berjaya dalam penggunaan kosa kata mencabar. Kerap menggunakan "eksponen" secara konsisten dalam melontarkan unjuran pelaburan.',
      icon: 'trending_up',
      locked: false,
      color: 'primary',
    },
    {
      id: 'crypto',
      name: 'Pendeta Kripto',
      date: 'Terkunci',
      desc: 'Capai markah sempurna dalam lima kuiz kosa kata matawang digital untuk memiliki lencana ini.',
      icon: 'lock',
      locked: true,
      color: 'primary',
    },
    {
      id: 'risk',
      name: 'Sarjana Risiko',
      date: 'Terkunci',
      desc: 'Berjaya mengimbangkan liku masa pada simulator tanpa menjejaskan ambang kecairan.',
      icon: 'monitoring',
      locked: true,
      color: 'tertiary',
    },
    {
      id: 'bank',
      name: 'Juru Bank',
      date: 'Terkunci',
      desc: 'Khusus untuk tahap penguasaan korporat. Bercakap lancar mengenai deposit bank dan frekuensi keuntungan.',
      icon: 'account_balance',
      locked: true,
      color: 'primary',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 animate-fade-in relative min-h-screen">
      
      {/* Header section */}
      <header className="mb-12 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#818cf8] via-[#c7d2fe] to-white bg-clip-text text-transparent">
          Bilik Kebal Penguasaan
        </h1>
        <p className="text-[#a1a1aa]/70 text-sm max-w-sm mx-auto leading-relaxed">
          Pencapaian amali dalam celik kewangan dan ketepatan linguistik anda, dipelihara dalam kristal kaca.
        </p>
      </header>

      {/* Stats Cards Overview Block */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[#818cf8] font-mono text-2xl font-bold mb-1">12/24</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/50">Dibuka</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[#c7d2fe] font-mono text-2xl font-bold mb-1">Top 5%</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/50">Kedudukan Global</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center col-span-2 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] animate-ping" />
            <span className="text-[#818cf8] font-mono text-lg font-bold">Prestij Baharu</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Sarjana Ekuiti</span>
        </div>
      </div>

      {/* Grid displays of crystallised Badges */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 py-4">
        {badges.map((b) => (
          <div 
            key={b.id}
            onClick={() => {
              if (!b.locked) setSelectedBadge(b);
            }}
            className={`flex flex-col items-center text-center transition-all ${
              b.locked 
                ? 'grayscale opacity-30 cursor-not-allowed select-none' 
                : 'hover:-translate-y-2 cursor-pointer group active:scale-95'
            }`}
          >
            {/* Round Badge Sphere */}
            <div className="relative w-28 h-28 mb-4">
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-25 group-hover:opacity-45 transition-all ${
                b.color === 'primary' ? 'bg-[#6366f1]' : 'bg-[#312e81]'
              }`} />
              
              <div className={`relative z-10 w-full h-full glass-panel rounded-full flex items-center justify-center p-4 border-2 overflow-hidden transition-all ${
                b.color === 'primary' ? 'border-[#818cf8]/40' : 'border-[#c7d2fe]/40'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-tr opacity-25 ${
                  b.color === 'primary' ? 'from-indigo-500/30 to-indigo-700/30' : 'from-slate-800/30 to-indigo-900/30'
                }`} />
                <span className={`material-symbols-outlined text-4xl ${
                  b.color === 'primary' ? 'text-[#818cf8]' : 'text-[#c7d2fe]'
                }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {b.icon}
                </span>
              </div>
            </div>

            {/* Title list names */}
            <h3 className={`font-display text-[11px] font-bold tracking-widest uppercase transition-colors ${
              b.locked ? 'text-[#a1a1aa]/40' : 'text-indigo-300 group-hover:text-indigo-200'
            }`}>
              {b.name}
            </h3>
          </div>
        ))}
      </section>

      {/* Detailed Achievement popup Drawer Modal */}
      {selectedBadge && (
        <div 
          onClick={() => setSelectedBadge(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 transition-opacity duration-300 animate-fade-in"
        >
          {/* Modal core */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-sm w-full rounded-3xl p-8 border-white/20 shadow-2xl relative animate-zoom-in"
          >
            {/* Close trigger */}
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute right-6 top-6 text-[#a1a1aa]/60 hover:text-white cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined font-bold text-lg">close</span>
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-20 h-20 mb-6 glass-panel rounded-full flex items-center justify-center border-2 border-[#818cf8]/40 shadow-[0_0_20px_rgba(99,102,241,0.35)] bg-indigo-500/5">
                <span className="material-symbols-outlined text-3xl text-[#818cf8]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {selectedBadge.icon}
                </span>
              </div>
              
              <h2 className="font-display text-2xl font-extrabold text-[#818cf8] mb-1">{selectedBadge.name}</h2>
              <p className="font-mono text-xs text-[#c7d2fe] mb-6 tracking-widest uppercase font-semibold">{selectedBadge.date}</p>
              
              <div className="w-full h-px bg-white/10 mb-6" />
              
              <p className="text-[#f4f4f5]/80 text-xs leading-relaxed mb-8 px-2">
                {selectedBadge.desc}
              </p>

              <button 
                onClick={() => alert(`Direct share token constructed for ${selectedBadge.name}! LinkedIn post initiated successfully.`)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#312e81] text-white font-display text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 hover:brightness-110 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Kongsi ke LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
