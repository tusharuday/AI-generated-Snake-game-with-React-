import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-fuchsia-500/30 shadow-[0_0_50px_-12px_rgba(217,70,239,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0 group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)]"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-fuchsia-500/20 rounded-2xl ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-400 font-medium text-sm tracking-wide uppercase opacity-80">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 shadow-[0_0_10px_#d946ef]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-2 text-fuchsia-400 hover:text-white transition-colors active:scale-90"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-fuchsia-500 text-black rounded-full flex items-center justify-center hover:bg-fuchsia-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.5)]"
            >
              {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </button>

            <button 
              onClick={handleNext}
              className="p-2 text-fuchsia-400 hover:text-white transition-colors active:scale-90"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-fuchsia-400/60">
            <Volume2 size={16} />
            <div className="w-16 h-1 bg-slate-800 rounded-full">
              <div className="w-2/3 h-full bg-fuchsia-500/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-fuchsia-500/10">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-fuchsia-500/40">
          <span>Audio Stream Active</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
