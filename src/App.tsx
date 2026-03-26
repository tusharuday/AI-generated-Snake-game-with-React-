import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Neon <span className="text-cyan-400">Snake</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-cyan-500/60">
            <span className="flex items-center gap-1"><Gamepad2 size={14} /> Arcade Mode</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="flex items-center gap-1"><Music size={14} /> Lo-Fi Beats</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          {/* Game Section */}
          <section className="flex-1 flex justify-center order-2 lg:order-1">
            <SnakeGame />
          </section>

          {/* Player Section */}
          <section className="flex-shrink-0 order-1 lg:order-2">
            <MusicPlayer />
          </section>
        </div>

        {/* Footer Info */}
        <footer className="mt-auto pt-8 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
          <p className="text-[10px] uppercase tracking-widest font-medium">
            Designed for the <span className="text-cyan-400">Cyberpunk</span> Era &copy; 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
