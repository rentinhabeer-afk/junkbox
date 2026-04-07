import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Player: React.FC = () => {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrevious, volume, setVolume, progress, duration, seek } = usePlayer();
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  if (!currentSong) {
    return (
      <div className="h-16 md:h-24 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-4 md:px-6 z-50 relative">
        <div className="w-full md:w-1/3"></div>
        <div className="hidden md:flex w-1/3 flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition"><Shuffle className="w-4 h-4" /></button>
            <button className="text-gray-400 hover:text-white transition"><SkipBack className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition">
              <Play className="w-5 h-5 ml-1" />
            </button>
            <button className="text-gray-400 hover:text-white transition"><SkipForward className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-white transition"><Repeat className="w-4 h-4" /></button>
          </div>
          <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-400">
            <span>0:00</span>
            <div className="h-1 flex-1 bg-gray-800 rounded-full"></div>
            <span>0:00</span>
          </div>
        </div>
        <div className="hidden md:block w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="h-16 md:h-24 bg-[#0a0502]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-4 md:px-6 z-50 relative">
      {/* Mobile Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 md:hidden">
        <div className="h-full bg-[#ff4e00]" style={{ width: `${(progress / (duration || 1)) * 100}%` }}></div>
      </div>

      <div className="w-full md:w-1/3 flex items-center justify-between md:justify-start gap-4">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover shadow-lg flex-shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-medium text-sm hover:underline cursor-pointer truncate">{currentSong.title}</span>
            <span className="text-gray-400 text-xs hover:underline cursor-pointer truncate">{currentSong.artist}</span>
          </div>
          <button className="hidden md:block ml-4 text-gray-400 hover:text-white transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-4 flex-shrink-0">
          <button className="text-gray-400 hover:text-white transition">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={togglePlayPause} className="text-white">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
        </div>
      </div>

      <div className="hidden md:flex w-1/3 flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition"><Shuffle className="w-4 h-4" /></button>
          <button onClick={playPrevious} className="text-gray-400 hover:text-white transition"><SkipBack className="w-5 h-5" /></button>
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button onClick={playNext} className="text-gray-400 hover:text-white transition"><SkipForward className="w-5 h-5" /></button>
          <button className="text-gray-400 hover:text-white transition"><Repeat className="w-4 h-4" /></button>
        </div>
        
        <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-400">
          <span className="w-10 text-right">{formatTime(progress)}</span>
          <div 
            className="group relative flex-1 h-3 flex items-center cursor-pointer"
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
          >
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleProgressChange}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden relative">
              <div 
                className={`h-full bg-white rounded-full ${isHoveringProgress ? 'bg-[#ff4e00]' : ''}`}
                style={{ width: `${(progress / (duration || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden md:flex w-1/3 items-center justify-end gap-3">
        <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-gray-400 hover:text-white transition">
          {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="w-24 group relative flex h-3 items-center cursor-pointer">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gray-400 group-hover:bg-[#ff4e00] rounded-full transition-colors"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
