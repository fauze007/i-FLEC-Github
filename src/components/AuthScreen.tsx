import React, { useState, useEffect } from 'react';
import { googleSignIn } from '../lib/googleAuth';

interface AuthScreenProps {
  onLogin: (email: string, displayName?: string, photoURL?: string, workspaceToken?: string) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orbCoords, setOrbCoords] = useState({ x: 0, y: 0 });

  // Parallax effect on mouse move for background auroras
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setOrbCoords({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email || 'fauze@elite.com.my');
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        onLogin(
          result.user.email || 'user@elite.com', 
          result.user.displayName || undefined, 
          result.user.photoURL || undefined,
          result.accessToken
        );
      }
    } catch (error) {
      console.error("Firebase Google Auth Error", error);
      alert("Failed to authenticate.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#09090b] font-sans selection:bg-indigo-500/30">
      {/* Aurora Orbs */}
      <div 
        className="aurora-orb w-[600px] h-[600px] bg-[#312e81] top-[-10%] left-[-10%] transition-transform duration-300 ease-out"
        style={{ transform: `translate(${orbCoords.x * 0.8}px, ${orbCoords.y * 0.8}px)` }}
      />
      <div 
        className="aurora-orb w-[500px] h-[500px] bg-[#6366f1] bottom-[-10%] right-[-10%] transition-transform duration-300 ease-out"
        style={{ transform: `translate(${orbCoords.x * -1.2}px, ${orbCoords.y * -1.2}px)`, animationDelay: '-5s' }}
      />
      <div 
        className="aurora-orb w-[400px] h-[400px] bg-[#312e81] top-[40%] right-[10%] transition-transform duration-300 ease-out"
        style={{ transform: `translate(${orbCoords.x * 1.5}px, ${orbCoords.y * -0.5}px)`, animationDelay: '-10s' }}
      />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[440px] px-5 flex flex-col items-center">
        
        {/* Animated AI Mentor Logo */}
        <div className="mb-12 relative">
          <div className="w-[100px] h-[100px] rounded-full bg-black/20 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(99,102,241,0.5)] shadow-[0_0_30px_rgba(99,102,241,0.6)] z-10 overflow-hidden backdrop-blur-xl">
            <img src="https://i.imgur.com/2TJihxS.png" alt="i-FLEC Logo" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
          </div>
          {/* Rotating Rings */}
          <div className="absolute inset-[-10px] border-2 border-indigo-500/20 rounded-full animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-[-15px] border border-indigo-600/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
        </div>

        {/* Login Card */}
        <div className="glass-panel w-full rounded-[32px] p-8 md:p-10 flex flex-col gap-8 transition-all duration-500 hover:border-white/15">
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Selamat Datang ke i-FLEC
            </h1>
            <p className="text-sm md:text-base text-indigo-100/70 tracking-wide font-normal">
              Kuasai bahasa kekayaan.
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat E-mel"
                  className="w-full px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-indigo-100/30 font-sans focus:bg-white/[0.07] focus:border-white/40 focus:backdrop-blur-[32px] focus:outline-none transition-all duration-300"
                />
              </div>
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Laluan"
                  className="w-full px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-indigo-100/30 font-sans focus:bg-white/[0.07] focus:border-white/40 focus:backdrop-blur-[32px] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="shadow-[0_0_15px_rgba(99,102,241,0.5)] w-full bg-gradient-to-r from-[#6366f1] to-[#ff4e7c] hover:opacity-95 text-white font-display text-[14px] tracking-widest font-medium py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <span>MULA PERJALANAN</span>
              <span className="material-symbols-outlined text-sm font-semibold">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <span className="font-display text-xs tracking-widest text-[#a1a1aa]/40">OR</span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onLogin('apple.user@elite.com')}
              className="glass-panel py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-white"
            >
              <span className="material-symbols-outlined text-lg">brand_awareness</span>
              <span className="font-display text-xs tracking-wider font-medium">Apple</span>
            </button>
            <button 
              type="button"
              onClick={handleGoogleAuth}
              className="glass-panel py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-white"
            >
              <span className="material-symbols-outlined text-lg">google_plus_reshare</span>
              <span className="font-display text-xs tracking-wider font-medium">Google</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs text-[#a1a1aa]/50 tracking-wide">
            Tiada akaun?{' '}
            <button 
              onClick={() => onLogin('elite.member@elite.com')}
              className="text-indigo-300 hover:text-indigo-200 underline transition-all font-medium cursor-pointer"
            >
              Sertai Golongan Elit
            </button>
          </p>
        </footer>
      </main>
    </div>
  );
}
