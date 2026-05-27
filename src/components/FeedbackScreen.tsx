import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface FeedbackScreenProps {
  avatarUrl: string;
}

export default function FeedbackScreen({ avatarUrl }: FeedbackScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Greetings. I'm Aria Mentor. I've analyzed your explanation of compound interest. You demonstrated excellent conceptual clarity, but I've spotted a few grammar rules where we can refine your linguistic precision. Ready for the critique?",
      timestamp: 'JUST NOW',
    },
    {
      id: '2',
      sender: 'user',
      text: '"Compound interest is when you get interest on your interest and your money grow very fast over time."',
      timestamp: 'SENT 12:04 PM',
    },
    {
      id: '3',
      sender: 'ai',
      text: 'Your conceptual grasp is solid! However, notice the subject-verb agreement:',
      timestamp: 'JUST NOW',
      correction: {
        error: 'grow',
        //@ts-ignore
        arrow: 'arrow_forward',
        fix: 'grows',
      },
    },
    {
      id: '4',
      sender: 'ai',
      text: 'In professional financial discourse, we often replace "very fast" with "exponentially" or "at an accelerated pace" to convey authority and expertise.',
      timestamp: 'JUST NOW',
      hasStats: true,
      accuracy: 82,
      fluency: 94,
    },
    {
      id: '5',
      sender: 'ai',
      text: 'Would you like to try rephrasing that sentence with the corrected grammar and a more professional tone?',
      timestamp: 'JUST NOW',
    }
  ]);

  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real TTS Voice Synthesis!
  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Filter out raw quote marks or visual indicators for cleaner audio
      const cleanText = text.replace(/["']/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Let's attempt to select an elegant English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural')));
      if (preferred) utterance.voice = preferred;
      utterance.pitch = 1.05;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech synthesis is not supported on this device's browser.");
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: `"${inputText}"`,
      timestamp: 'SENT JUST NOW',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Process grammar suggestions instantly!
    setTimeout(() => {
      const userTextLower = userMessage.text.toLowerCase();
      let responseMsg: ChatMessage;

      if (userTextLower.includes('grow') && !userTextLower.includes('grows')) {
        responseMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Perfect re-try! Oh look, you are testing subject-verb agreement. In this context, "money" is singular, so it requires "grows". Let us continue practicing!',
          timestamp: 'JUST NOW',
          correction: {
            error: 'money grow',
            fix: 'money grows',
          },
          hasStats: true,
          accuracy: 91,
          fluency: 96,
        };
      } else if (userTextLower.includes('grows') && (userTextLower.includes('exponential') || userTextLower.includes('pace'))) {
        responseMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Superb! An immaculate explanation with top-tier vocabulary. Rephrasing is highly effective for retention.',
          timestamp: 'JUST NOW',
          hasStats: true,
          accuracy: 100,
          fluency: 98,
        };
      } else {
        responseMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Excellent practice. I have checked your speech patterns. Your fluency is perfect; you used solid vocab anchors like "interest". Let’s target our pronunciation now!',
          timestamp: 'JUST NOW',
          hasStats: true,
          accuracy: 85,
          fluency: 92,
        };
      }

      setMessages((prev) => [...prev, responseMsg]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-44 animate-fade-in relative min-h-screen">
      {/* Scrollable messages area */}
      <div className="space-y-8 pt-4 pb-20">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {/* Sender block */}
            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1.5`}>
              {/* Message Bubble */}
              <div 
                className={`p-6 rounded-2xl max-w-[85%] shadow-xl transition-all ${
                  msg.sender === 'user' 
                    ? 'rounded-tr-none bg-indigo-500/10 border border-indigo-500/20 text-[#f4f4f5]' 
                    : 'rounded-tl-none bg-slate-950/40 border-l-[4px] border-l-[#6366f1] text-white backdrop-blur-md'
                }`}
              >
                <p className="text-[15px] leading-relaxed font-normal">
                  {msg.sender === 'ai' ? (
                    // Accent keyword coloring
                    <span dangerouslySetInnerHTML={{ 
                      __html: msg.text
                        .replace(/(compound interest)/gi, '<strong class="text-indigo-300 font-bold">$1</strong>')
                        .replace(/(exponentially)/gi, '<span class="text-slate-300 font-medium italic">"$1"</span>')
                        .replace(/(at an accelerated pace)/gi, '<span class="text-slate-300 font-medium italic">"$1"</span>')
                    }} />
                  ) : (
                    msg.text
                  )}
                </p>

                {/* Sub Correction Panel if exists */}
                {msg.correction && (
                  <div className="glass-panel p-4 rounded-xl bg-white/5 border-white/5 text-sm italic mt-4 flex items-center gap-2">
                    <span>"...and your money</span>
                    <span className="text-red-400 line-through font-semibold">{msg.correction.error}</span>
                    <span className="material-symbols-outlined text-xs text-indigo-400">arrow_forward</span>
                    <span className="text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                      {msg.correction.fix}
                    </span>
                    <span>very fast..."</span>
                  </div>
                )}
              </div>

              {/* Timestamp info */}
              <span className="text-[#a1a1aa]/40 text-[10px] uppercase tracking-widest px-1">
                {msg.timestamp}
              </span>
            </div>

            {/* If has Stats, embed beautiful circle bars */}
            {msg.hasStats && (
              <div className="grid grid-cols-2 gap-4 mt-5 mb-2 max-w-[85%] self-start w-full">
                <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa]/60 text-xs tracking-wider mb-2 font-display">ACCURACY</span>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle 
                        className="text-indigo-500 transition-all duration-1000" 
                        cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" 
                        strokeDasharray="175.9" 
                        strokeDashoffset={175.9 - (175.9 * (msg.accuracy || 82)) / 100} 
                        strokeLinecap="round"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                    <span className="absolute font-display text-indigo-300 text-sm font-bold">{msg.accuracy}%</span>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa]/60 text-xs tracking-wider mb-2 font-display">KELANCARAN</span>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle 
                        className="text-slate-400 transition-all duration-1000" 
                        cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" 
                        strokeDasharray="175.9" 
                        strokeDashoffset={175.9 - (175.9 * (msg.fluency || 94)) / 100} 
                        strokeLinecap="round"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                    <span className="absolute font-display text-slate-300 text-sm font-bold">{msg.fluency}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Floating Bottom Input & Action Chips */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/90 to-transparent pt-6 pb-28 px-5">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* Action Chips */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => playTTS("Compound interest is when you get interest on your interest and your money grows exponentially over time.")}
              className="glass-panel px-4 py-2 rounded-full whitespace-nowrap text-xs font-semibold text-indigo-300 flex items-center gap-1.5 hover:bg-indigo-500/15 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">refresh</span>
              Replay pronunciation
            </button>
            <button 
              onClick={() => {
                setInputText("Can you explain how compounding frequencies differ daily versus annually?");
              }}
              className="glass-panel px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium text-[#a1a1aa]/80 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Explain compounding
            </button>
            <button 
              onClick={() => {
                setInputText("Let's practice vocabulary words for high-growth venture capital portfolios.");
              }}
              className="glass-panel px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium text-[#a1a1aa]/80 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Practice more finance
            </button>
          </div>

          {/* Text Input Area */}
          <div className="relative group">
            {/* Ambient background accent overlay */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#312e81] rounded-2xl blur opacity-15 group-focus-within:opacity-30 transition duration-500"></div>
            
            <div className="relative flex items-center glass-panel rounded-xl p-1.5 px-4 gap-3 border-white/15 focus-within:border-indigo-500/35 transition-all bg-[#140f1f]/80 backdrop-blur-3xl">
              {/* Mic trigger */}
              <button 
                onClick={() => {
                  setInputText("Compound interest is when your money grows at an accelerated pace...");
                }}
                className="material-symbols-outlined text-[#a1a1aa]/60 hover:text-indigo-300 p-1 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
                title="Simulate speech recording input"
              >
                mic
              </button>

              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                type="text" 
                placeholder="Type or dictate a professional response..."
                className="w-full bg-transparent border-none text-white text-sm placeholder-indigo-100/30 focus:outline-none focus:ring-0"
              />

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setInputText("Here is a summary list of equity returns")}
                  className="material-symbols-outlined text-[#a1a1aa]/50 hover:text-white cursor-pointer"
                >
                  attach_file
                </button>
                <button 
                  onClick={handleSend}
                  className="w-9 h-9 bg-gradient-to-tr from-[#6366f1] to-[#ff4e7c] rounded-xl flex items-center justify-center text-white cursor-pointer shadow-lg active:scale-95 hover:brightness-110 transition-all"
                >
                  <span className="material-symbols-outlined text-lg leading-none font-bold">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
