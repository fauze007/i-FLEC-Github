import React, { useState } from 'react';
import { Module } from './types';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import FeedbackScreen from './components/FeedbackScreen';
import BudgetSimulator from './components/BudgetSimulator';
import PitchRoom from './components/PitchRoom';
import VaultOfPenguasaan from './components/VaultOfPenguasaan';
import PerformanceHub from './components/PerformanceHub';
import WorkspaceHub from './components/WorkspaceHub';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'simulator' | 'feedback' | 'pitch' | 'achievements' | 'performance' | 'workspace'>('dashboard');
  const [userName, setUserName] = useState('Alex');
  const [userEmail, setUserEmail] = useState('fauze007@gmail.com');
  const [streak, setStreak] = useState(12);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [workspaceToken, setWorkspaceToken] = useState<string | null>(null);

  // Avatar URL matching mockup 3
  const avatarUrl = customAvatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCSFsiA8vt_5KjlFl61brgcWz92VuK6dMd2HrAjYPzScBx4jDXCia5lAdAe8jZnRnK6i9VZjnGk7nEOPkhC6FEpAu01nSGZZwNIOyGZGh8ksZ07-BuZTVMGkymqUdiO_r4fjqf9rv6pDuw4r4xzANwYnY_r_ifYJyMBf9yFcyGpGE7b-wQ-yltEQY3TYKfSrRL3H_aIuxtVbrLotoJW4_nQX8w8e4SzlDGupls1kTvZgW-YFNfD-gijzX_U_8v-kZ48Yf5IDrs1KxQ";

  // Initializing high-fidelity modules matching design layouts
  const initialModules: Module[] = [
    {
      id: 'vocab',
      title: 'Kosa Kata Modal Teroka',
      subtitle: 'Dialek Elit Korporat',
      icon: 'account_balance_wallet',
      progress: 70,
    },
    {
      id: 'compound',
      title: 'Asas Faedah Kompaun',
      subtitle: 'Kuasa Simpanan (ASB)',
      icon: 'insights',
      progress: 20,
    },
    {
      id: 'pitch',
      title: 'Reka Bentuk "Elevator Pitch"',
      subtitle: 'Narrative Penguasaan',
      icon: 'record_voice_over',
      progress: 90,
    },
  ];

  const [modules, setModules] = useState<Module[]>(initialModules);

  // Handle module selections from home dashboard
  const handleSelectModule = (moduleId: string) => {
    if (moduleId === 'compound') {
      setCurrentTab('simulator');
    } else if (moduleId === 'pitch') {
      setCurrentTab('pitch');
    } else {
      setCurrentTab('feedback');
    }
  };

  const handleLogin = (email: string, displayName?: string, photoURL?: string, token?: string) => {
    setUserEmail(email);
    if (displayName) {
      setUserName(displayName);
    } else {
      const part = email.split('@')[0];
      const rawName = part.charAt(0).toUpperCase() + part.slice(1);
      setUserName(rawName === 'Fauze007' ? 'Fauze' : rawName);
    }
    if (photoURL) {
      setCustomAvatarUrl(photoURL);
    }
    if (token) {
      setWorkspaceToken(token);
    }
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  // If user is not authenticated, render login panel
  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Render correct tab view
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardScreen 
            userName={userName}
            avatarUrl={avatarUrl}
            streak={streak}
            modules={modules}
            onSelectModule={handleSelectModule}
            onNavigate={(tab) => setCurrentTab(tab as any)}
          />
        );
      case 'simulator':
        return <BudgetSimulator />;
      case 'feedback':
        return <FeedbackScreen avatarUrl={avatarUrl} />;
      case 'pitch':
        return <PitchRoom />;
      case 'achievements':
        return <VaultOfPenguasaan />;
      case 'performance':
        return <PerformanceHub />;
      case 'workspace':
        return <WorkspaceHub workspaceToken={workspaceToken} />;
      default:
        return (
          <DashboardScreen 
            userName={userName}
            avatarUrl={avatarUrl}
            streak={streak}
            modules={modules}
            onSelectModule={handleSelectModule}
            onNavigate={(tab) => setCurrentTab(tab as any)}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] pb-10 overflow-x-hidden font-sans">
      
      {/* Immersive UI Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none"></div>

      {/* Persistent Glassmorphic Top Bar Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
        <div className="flex justify-between items-center px-5 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Click avatar to switch to custom state / user info */}
            <div 
              onClick={() => {
                const check = window.confirm(`Log out as ${userName}?`);
                if (check) setIsLoggedIn(false);
              }}
              className="w-10 h-10 rounded-full border-2 border-indigo-500/30 p-0.5 overflow-hidden cursor-pointer hover:border-indigo-500/80 transition-all duration-300"
              title="Klik untuk Log Keluar"
            >
              <img 
                src={avatarUrl} 
                className="w-full h-full object-cover rounded-full" 
                alt="Profile Avatar" 
              />
            </div>
            
            {/* Platform Brand Title */}
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="font-display text-2xl font-extrabold text-[#818cf8] tracking-tighter hover:opacity-85 transition-opacity cursor-pointer flex items-center gap-2"
            >
              <img src="https://i.imgur.com/2TJihxS.png" alt="i-FLEC Logo" className="w-8 h-8 rounded-md" referrerPolicy="no-referrer" />
              i-FLEC
            </button>
          </div>

          {/* Sub Navigation controls helper in Header header */}
          <div className="flex items-center gap-3">
            {currentTab === 'feedback' && (
              <button 
                onClick={() => setCurrentTab('pitch')}
                className="glass-panel px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300 border-indigo-500/30 flex items-center gap-1.5 hover:bg-indigo-500/10 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                Bilik Pembentangan
              </button>
            )}

            {currentTab === 'pitch' && (
              <button 
                onClick={() => setCurrentTab('feedback')}
                className="glass-panel px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 border-slate-500/30 flex items-center gap-1.5 hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">forum</span>
                Sembang Kritikan AI
              </button>
            )}

            {/* Flame streak count button widget */}
            <div 
              onClick={() => {
                setStreak(prev => prev + 1);
                alert("Hebat! Kuasai modul anda setiap hari untuk mengekalkan rentak harian (streak) anda.");
              }}
              className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 hover:bg-white/15 cursor-pointer select-none transition-all duration-200"
              title="Daily active streak counter"
            >
              <span 
                className="material-symbols-outlined text-[#22c55e] text-xl animate-pulse" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-display text-sm font-bold text-white font-mono">
                {streak}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard views container */}
      <main className="relative z-10 pt-24 px-5 max-w-7xl mx-auto">
        {renderContent()}
      </main>

      {/* Dynamic Glassmorphic Navigation Docking shell (Apple Vision / iOS styling) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 flex justify-around items-center py-2 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full bg-white/5 p-1 transition-all duration-300">
        
        {/* Dashboard button */}
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'dashboard' 
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Dashboard"
        >
          <span className="material-symbols-outlined font-light">dashboard</span>
        </button>

        {/* Compound / Finance */}
        <button 
          onClick={() => setCurrentTab('simulator')}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'simulator' 
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Investment Simulator"
        >
          <span className="material-symbols-outlined font-light">account_balance_wallet</span>
        </button>

        {/* Aria Voice Feedback or Pitch Teleprompter Switch */}
        <button 
          onClick={() => {
            // default to feedback chat first
            if (currentTab === 'feedback' || currentTab === 'pitch') {
              setCurrentTab(currentTab === 'feedback' ? 'pitch' : 'feedback');
            } else {
              setCurrentTab('feedback');
            }
          }}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'feedback' || currentTab === 'pitch'
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Aria Mentor Critique Speech"
        >
          <span className="material-symbols-outlined font-light">
            {currentTab === 'pitch' ? 'interpreter_mode' : 'record_voice_over'}
          </span>
        </button>

        {/* performance analytics */}
        <button 
          onClick={() => setCurrentTab('performance')}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'performance' 
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Hab Prestasi analytics"
        >
          <span className="material-symbols-outlined font-light">insights</span>
        </button>

        {/* Achievements / Bilik Kebal Penguasaan */}
        <button 
          onClick={() => setCurrentTab('achievements')}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'achievements' 
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Bilik Kebal Penguasaan achievements"
        >
          <span className="material-symbols-outlined font-light">military_tech</span>
        </button>

        {/* Workspace Hub */}
        <button 
          onClick={() => setCurrentTab('workspace')}
          className={`relative p-3 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
            currentTab === 'workspace' 
              ? 'bg-[#818cf8]/20 text-[#818cf8] shadow-[0_0_15px_rgba(255,178,190,0.4)]' 
              : 'text-[#a1a1aa]/60 hover:text-white hover:bg-white/5'
          }`}
          title="Google Workspace"
        >
          <span className="material-symbols-outlined font-light">cloud_sync</span>
        </button>
        
      </nav>
    </div>
  );
}
