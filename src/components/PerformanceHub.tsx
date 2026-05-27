import React, { useState } from 'react';

export default function PerformanceHub() {
  const [activeStat, setActiveStat] = useState<string | null>(null);

  // Six dimensions mapping
  const axes = [
    { label: 'KOSA KATA', value: 85, color: '#818cf8', angle: 0 },
    { label: 'PELABURAN', value: 72, color: '#c7d2fe', angle: 60 },
    { label: 'BAJET', value: 90, color: '#c7d2fe', angle: 120 },
    { label: 'HUTANG', value: 65, color: '#c7d2fe', angle: 180 },
    { label: 'TATABAHASA', value: 82, color: '#818cf8', angle: 240 },
    { label: 'KELANCARAN', value: 94, color: '#818cf8', angle: 300 },
  ];

  // Helper calculating SVG coordinate maps
  const getCoordinates = (angleDegrees: number, scaleValue: number) => {
    // Math.sin and cos work in radians
    const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
    const radius = 120; // max width bound
    const normalizedLength = (scaleValue / 100) * radius;
    const x = 200 + normalizedLength * Math.cos(angleRadians);
    const y = 200 + normalizedLength * Math.sin(angleRadians);
    return { x, y };
  };

  // Build polygon coordinates series
  const points = axes.map(axis => {
    const coords = getCoordinates(axis.angle, axis.value);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-8 animate-fade-in text-on-background">
      
      {/* Header section */}
      <header className="w-full text-center">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#818cf8] to-[#c7d2fe] bg-clip-text text-transparent leading-tight">
          Hab Prestasi
        </h1>
        <p className="text-sm text-[#a1a1aa]/70 max-w-sm mx-auto">
          Metrik pertumbuhan anda sepanjang 30 hari yang lepas.
        </p>
      </header>

      {/* Concentrate Radar Chart Area */}
      <div className="relative w-full aspect-square max-w-[420px] mx-auto glass-panel rounded-full flex items-center justify-center mb-8 overflow-hidden py-10">
        
        {/* Concentric rings in absolute layer */}
        <div className="absolute inset-0 rotate-slow opacity-25">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            {/* Standard concentric background radial webs */}
            <circle cx="200" cy="200" r="150" className="stroke-white/10 fill-none" strokeWidth="1" />
            <circle cx="200" cy="200" r="112" className="stroke-white/10 fill-none" strokeWidth="1" />
            <circle cx="200" cy="200" r="75" className="stroke-white/10 fill-none" strokeWidth="1" />
            <circle cx="200" cy="200" r="37" className="stroke-white/10 fill-none" strokeWidth="1" />

            {/* Split lines */}
            <line x1="200" y1="50" x2="200" y2="350" className="stroke-white/10" strokeWidth="1" />
            <line x1="70" y1="125" x2="330" y2="275" className="stroke-white/10" strokeWidth="1" />
            <line x1="70" y1="275" x2="330" y2="125" className="stroke-white/10" strokeWidth="1" />
          </svg>
        </div>

        {/* Dynamic Interactive SVG Chart */}
        <svg className="relative z-10 w-full h-full p-10 select-none" viewBox="0 0 400 400">
          
          {/* Active stats polygon */}
          <polygon 
            points={points}
            className="fill-[#6366f1]/25 stroke-[#6366f1] stroke-[3px] transition-all duration-500 ease-out"
            filter="drop-shadow(0 0 8px rgba(99, 102, 241, 0.55))"
          />

          {/* Render individual axis dots & text anchors */}
          {axes.map((axis, i) => {
            const labelCoords = getCoordinates(axis.angle, 125);
            const dotCoords = getCoordinates(axis.angle, axis.value);
            
            // Text alignment calculations
            let textAnchor = 'middle';
            let dy = '0';
            if (axis.angle === 0) { textAnchor = 'middle'; dy = '-10px'; }
            else if (axis.angle === 180) { textAnchor = 'middle'; dy = '18px'; }
            else if (axis.angle > 0 && axis.angle < 180) { textAnchor = 'start'; dx: '8px'; }
            else { textAnchor = 'end'; dx: '-8px'; }

            return (
              <g key={i} className="group cursor-pointer" onClick={() => setActiveStat(axis.label)}>
                
                {/* Luminous value coordinate bullet */}
                <circle 
                  cx={dotCoords.x} 
                  cy={dotCoords.y} 
                  r="6" 
                  className="fill-[#6366f1] stroke-white stroke-2 transition-all duration-300"
                />

                {/* Dimension name label */}
                <text 
                  x={labelCoords.x} 
                  y={labelCoords.y} 
                  dy={dy}
                  className={`font-display text-[11px] font-bold tracking-widest ${
                    axis.color === '#818cf8' ? 'fill-indigo-200' : 'fill-slate-300'
                  }`}
                  textAnchor={textAnchor}
                >
                  {axis.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover coordinate label */}
        {activeStat && (
          <div className="absolute top-4 glass-panel px-4 py-1.5 rounded-full border-indigo-500/20 text-[10px] font-bold tracking-widest text-[#818cf8]">
            {activeStat}: {axes.find(a => a.label === activeStat)?.value}% MARKAH
          </div>
        )}
      </div>

      {/* Visual Stats 2x2 Grid layouts */}
      <section className="grid grid-cols-2 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => alert("Markah ketepatan semasa: 94%. Disemak berdasarkan 12 tugasan kosa kata kompaun.")}
          className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-white/20"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#818cf8]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/60 font-display">Ketepatan</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold text-[#818cf8]">94</span>
            <span className="text-xs text-[#a1a1aa]/40 font-bold">%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => alert("Status Tahap 2: dicapai melalui 10 sasaran ucapan.")}
          className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-32 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-white/20"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/60 font-display">Penguasaan</span>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-extrabold text-[#c7d2fe]">Tahap 2</span>
            <div className="w-full bg-white/15 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-slate-400 to-indigo-600 h-full rounded-full w-2/3 shadow-[0_0_10px_rgba(224,183,255,0.5)]" 
              />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => alert("Jurang Leksikon menunjukkan jarak ke ambang eksekutif perbankan profesional C1.")}
          className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-32 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-white/20"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/60 font-display">Jurang Leksikon</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold text-[#818cf8]">-12</span>
            <span className="text-xs text-[#a1a1aa]/40 font-bold">mata</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => alert("Markah keseluruhan berdasarkan ringkasan pembentangan kompaun.")}
          className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-white/20"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c7d2fe]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]/60 font-display">Purata Skor</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold text-[#c7d2fe]">8.8</span>
            <span className="text-xs text-[#a1a1aa]/45 font-bold">/10</span>
          </div>
        </div>
      </section>

      {/* Neon Mint Premium CTA Action Button */}
      <section>
        <button 
          onClick={() => {
            alert("Menyusun laporan eksekutif... Menjana transkrip PDF yang mengandungi penjejakan faedah kompaun dan log ketepatan...");
            window.print();
          }}
          className="w-full py-4.5 border border-[#22c55e]/35 rounded-2xl flex items-center justify-center gap-2.5 group hover:bg-[#22c55e]/5 duration-300 transition-all cursor-pointer block text-center"
        >
          <span className="material-symbols-outlined text-[#22c55e] group-hover:scale-110 transition-transform text-lg">
            picture_as_pdf
          </span>
          <span className="font-display text-xs tracking-[0.2em] font-bold text-[#22c55e] uppercase mint-glow">
            Muat Turun Laporan PDF
          </span>
        </button>
      </section>
    </div>
  );
}
