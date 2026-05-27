import React, { useState, useEffect, useRef } from 'react';

// Encode PCM Float32 to Base64 for the Live API
function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    // Convert -1..1 Float32 to Int16
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function PitchRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(new Array(36).fill(6));
  const prompterRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<NodeJS.Timeout | null>(null);
  
  // Real-time audio context references
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const startVoiceSession = async () => {
    try {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${proto}://${window.location.host}/api/live`);
      wsRef.current = ws;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          // Decode Base64 to ArrayBuffer
          const binary = atob(msg.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          
          // The API sends raw 16kHz PCM Int16. We need to convert it back to Float32.
          const int16Data = new Int16Array(bytes.buffer);
          const float32Data = new Float32Array(int16Data.length);
          for (let i = 0; i < int16Data.length; i++) {
            float32Data[i] = int16Data[i] / 32768.0;
          }
          
          // Create AudioBuffer
          const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 16000);
          audioBuffer.getChannelData(0).set(float32Data);
          
          // Schedule playback
          const sourceNode = audioCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.connect(audioCtx.destination);
          
          // Schedule seamlessly without gaps
          const playTime = Math.max(audioCtx.currentTime, nextStartTimeRef.current);
          sourceNode.start(playTime);
          nextStartTimeRef.current = playTime + audioBuffer.duration;
        }
        
        if (msg.interrupted) {
          nextStartTimeRef.current = audioCtx.currentTime;
        }
      };
      
      setIsRecording(true);
    } catch (err) {
      console.error("Live audio failed:", err);
      alert("Microphone configuration or API failed.");
    }
  };

  const endVoiceSession = () => {
    setIsRecording(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((trk) => trk.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      endVoiceSession();
    } else {
      startVoiceSession();
    }
  };

  // Timer counter when recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Audio Visualizer motion simulating mic intake
  useEffect(() => {
    let animId: any;
    if (isRecording) {
      const updateHeights = () => {
        setVisualizerHeights(() => 
          Array.from({ length: 36 }, () => Math.floor(Math.random() * 32) + 6)
        );
        animId = requestAnimationFrame(updateHeights);
      };
      updateHeights();
    } else {
      setVisualizerHeights(new Array(36).fill(6));
    }
    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  // Motorized auto-scrolling logic inside teleprompter box
  useEffect(() => {
    if (isRecording) {
      const prompter = prompterRef.current;
      if (prompter) {
        prompter.scrollTop = 0;
        let scrollSpeed = 0.6; // Scroll rate
        scrollRef.current = setInterval(() => {
          prompter.scrollTop += scrollSpeed;
          // Loop scroll at max bottom bounds
          if (prompter.scrollTop >= prompter.scrollHeight - prompter.clientHeight) {
            prompter.scrollTop = 0;
          }
        }, 30);
      }
    } else {
      if (scrollRef.current) clearInterval(scrollRef.current);
    }
    // ensure cleanup closes stream on unmount
    return () => {
      if (scrollRef.current) clearInterval(scrollRef.current);
      if (isRecording) endVoiceSession();
    };
  }, [isRecording]);

  // Format Elapsed counter
  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-between overflow-hidden rounded-[32px] font-sans selection:bg-indigo-500/20">
      
      {/* Cinematic Office Viewfinder Background */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Professional Boardroom" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZHyKQwBhPxgn0Q7ieSHXTHhC_AblpRO_9EDGpyyUwpJ7XZHs4y_ZBldckV8w5JGDIvDvlT8DBIHInesQosOC5E-1g4zhqS69FzeIWx4zkWIYi1kj-9MEhzlsATxA9AN2tJy8YKKftRq7UR8NVaBxSL9N6v8qVupuu9AOK-ojOhu0srlpoaDogoaVL78m5tUJXcQUz_c4v55KHI4go4VYYDf0KtcwnF_-PrIJGnbvYgfWHyQpzJntdSMyEa_CgYBHB2FErWD7Dygk" 
          className="w-full h-full object-cover grayscale opacity-30 brightness-[0.4]"
        />
        {/* Shadowed top/bottom curtains for visual fidelity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]" />
      </div>

      {/* Floating Header segment with Timer Pill */}
      <div className="relative z-10 w-full flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-emerald-200">
            {isRecording ? 'SEDANG MERAKAM...' : 'SEDIA UNTUK PEMBENTANGAN'}
          </span>
        </div>

        {/* Dynamic Telemetry Timer */}
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full bg-red-500 ${isRecording ? 'animate-ping' : ''}`} />
          <span className="font-mono text-sm font-semibold text-white tracking-widest">
            {formatTimer(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Teleprompter Scrolling glass enclosure */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 h-64 my-6">
        <div 
          ref={prompterRef}
          className="teleprompter-mask w-full h-full overflow-y-scroll no-scrollbar py-12 scroll-smooth"
        >
          <div className="flex flex-col gap-10 text-center pb-24">
            <p className="font-display text-lg md:text-2xl text-white/95 leading-relaxed font-semibold transition-all">
              "Selamat pagi panel kewangan. Hari ini, saya berbesar hati untuk memperkenalkan i-FLEC, program pengoptimuman kekayaan & bahasa kita."
            </p>
            <p className="font-display text-lg md:text-2xl text-white/80 leading-relaxed font-semibold transition-all">
              "Dengan menyepadukan lapisan 'glassmorphism' dan AI perbualan yang jitu, kami menyediakan medium pembelajaran yang mantap untuk calon eksekutif."
            </p>
            <p className="font-display text-lg md:text-2xl text-white/80 leading-relaxed font-semibold transition-all">
              "Mari fokus pada lekuk trajektori kekayaan: dengan hanya sedikit hasil 8% kompaun melebihi 25 tahun, klien menggandakan mod secara eksponen."
            </p>
            <p className="font-display text-lg md:text-2xl text-white/70 leading-relaxed font-semibold transition-all animate-pulse">
              "Terima kasih atas maklum balas ini. Saya mengalu-alukan sebarang pertanyaan mengenai nisbah modal atau matlamat dana teroka masa hadapan."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Micro Tip Overlay - Hidden on small layouts, rich on standard cards */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4">
        <div className="glass-panel p-5 rounded-[24px] border-l-[5px] border-l-indigo-400 flex items-start gap-3">
          <span className="material-symbols-outlined text-indigo-400 text-xl flex-shrink-0">auto_awesome</span>
          <div>
            <h4 className="font-display text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Petua Rakaman Mentor</h4>
            <p className="text-xs text-[#a1a1aa]/85 italic leading-relaxed">
              "Kekalkan rentak stabil (sekitar <strong className="text-white">145 patah perkataan seminit</strong>). Nada yang rendah mempamerkan keyakinan ketika membentangkan penyata kewangan."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Recording Visualizer Bars & Mic button grid */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6 py-8">
        
        {/* Spectrum Wave bars */}
        <div 
          className="w-full max-w-md h-12 flex items-end justify-center gap-[3px] transition-all duration-500 overflow-hidden"
          style={{ opacity: isRecording ? 1 : 0.2 }}
        >
          {visualizerHeights.map((h, i) => (
            <div 
              key={i} 
              className="w-1.5 rounded-full transition-all duration-75"
              style={{ 
                height: `${h}px`, 
                backgroundColor: h > 22 ? '#6366f1' : 'rgba(255, 178, 190, 0.45)',
                boxShadow: h > 25 ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Master Recording button frame */}
        <div className="relative flex items-center justify-center w-full max-w-md px-10">
          
          {/* Option side triggers */}
          <div className="absolute left-6">
            <button 
              onClick={() => alert("Speech pitch preset toggled to: 'Deep Executive'")}
              className="glass-panel p-3 rounded-full text-[#a1a1aa]/70 hover:text-indigo-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
              title="Pitch Tuner"
            >
              <span className="material-symbols-outlined text-lg">settings_voice</span>
            </button>
          </div>

          {/* Core Rec Key */}
          <button 
            onClick={toggleRecording}
            className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
          >
            {/* Pulsing visual halo */}
            {isRecording && (
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping pointer-events-none" />
            )}
            
            <div 
              className={`flex items-center justify-center bg-gradient-to-tr from-[#6366f1] to-[#ff4e7c] text-white shadow-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500 ${
                isRecording ? 'rounded-2xl w-10 h-10 bg-indigo-700' : 'rounded-full w-16 h-16'
              }`}
            >
              <span className="material-symbols-outlined text-3xl font-semibold leading-none">
                {isRecording ? 'square' : 'mic'}
              </span>
            </div>
          </button>

          {/* Option right trigger */}
          <div className="absolute right-6">
            <button 
              onClick={() => {
                alert("Simulated prompt feedback script generated. Saved to your Vault portfolio!");
              }}
              className="glass-panel p-3 rounded-full text-[#a1a1aa]/70 hover:text-indigo-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
              title="Save transcript"
            >
              <span className="material-symbols-outlined text-lg">description</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
