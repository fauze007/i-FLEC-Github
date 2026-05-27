import React from 'react';
import { Module } from '../types';

interface DashboardScreenProps {
  userName: string;
  avatarUrl: string;
  streak: number;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onNavigate: (tabId: string) => void;
}

export default function DashboardScreen({
  userName,
  avatarUrl,
  streak,
  modules,
  onSelectModule,
  onNavigate,
}: DashboardScreenProps) {
  return (
    <div className="w-full max-w-lg mx-auto pb-32">
      {/* App Header Image */}
      <div className="w-full flex justify-center mb-6 pt-2">
        <img src="https://i.imgur.com/DDXXGXD.png" alt="i-FLEC Header" className="w-48 h-auto object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Greeting Header */}
      <section className="mb-8 pt-2">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight mb-1 animate-fade-in">
          Selamat pagi, {userName}.
        </h1>
        <p className="text-sm font-normal text-[#a1a1aa]/80">
          Bersedia untuk skala tahap penguasaan anda?
        </p>
      </section>

      {/* Hero Streak Card */}
      <section className="mb-10">
        <div className="glass-panel p-8 rounded-[32px] relative overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.5)] flex flex-col items-center justify-center text-center">
          {/* Decorative radial lighting */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Badge Icon Wrapper */}
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-5 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <span className="material-symbols-outlined text-4xl text-indigo-400 font-light">
                military_tech
              </span>
            </div>
            
            <h2 className="font-display text-4xl font-extrabold text-white mb-2 leading-none">
              {streak} Hari Berturut-turut
            </h2>
            <p className="font-display text-xs tracking-[0.2em] font-medium text-indigo-400 uppercase">
              Penguasaan Sedang Berjalan
            </p>
          </div>

          {/* Glowing particle graphics in absolute corner */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Modul Harian Header */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-xs tracking-[0.15em] font-semibold text-[#a1a1aa]/70 uppercase">
            Modul Harian
          </h3>
          <button 
            onClick={() => onNavigate('achievements')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Senarai Bilik Kebal
          </button>
        </div>

        {/* List of Frosted Panels */}
        <div className="space-y-4">
          {modules.map((mod) => {
            // Draw standard SVG dash calculation
            const radius = 20;
            const strokeWidth = 4;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (mod.progress / 100) * circumference;

            return (
              <div 
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`group glass-panel p-6 rounded-[24px] flex items-center justify-between hover:bg-white/[0.08] active:scale-[0.99] transition-all duration-300 cursor-pointer ${
                  mod.id === 'compound' ? 'border-l-4 border-l-[#6366f1]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                    <span className="material-symbols-outlined text-slate-300 text-2xl font-light">
                      {mod.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm tracking-wide font-bold text-white mb-0.5 group-hover:text-indigo-100 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-[#a1a1aa]/60 font-medium">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>

                {/* Circular Progress Meter */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="24" 
                      cy="24" 
                      r={radius} 
                      fill="transparent" 
                      stroke="rgba(255, 255, 255, 0.08)" 
                      strokeWidth={strokeWidth} 
                    />
                    <circle 
                      cx="24" 
                      cy="24" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#818cf8" 
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-indigo-200">
                    {mod.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mentor Strategy Callout */}
      <section>
        <div 
          onClick={() => onNavigate('feedback')}
          className="glass-panel p-6 rounded-[32px] border-l-[6px] border-l-[#818cf8] flex items-start gap-4 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-indigo-400 mt-0.5 text-2xl animate-pulse">
            auto_awesome
          </span>
          <div>
            <h5 className="font-display text-xs tracking-[0.1em] font-bold text-white uppercase mb-1">
              Petua Aktif Mentor
            </h5>
            <p className="text-xs leading-relaxed text-[#a1a1aa]/80 font-normal">
              Fokus kepada <strong className="text-indigo-300 font-semibold">'Faedah Kompaun'</strong> hari ini. Berlatih 'elevator pitch' anda untuk menganalisis kosa kata dan memperbetulkan tatabahasa serta-merta!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
