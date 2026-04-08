import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song, Playlist } from '../data/mockData';
import localforage from 'localforage';

interface PlayerContextType {
  currentSong: Song | null;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  likedSongs: Song[];
  playSong: (song: Song, playlist?: Playlist) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localforage.getItem<Song[]>('liked_songs').then((songs) => {
      if (songs) {
        const restored = songs.map(song => {
          if (song.fileObj) {
            return { ...song, audioUrl: URL.createObjectURL(song.fileObj) };
          }
          return song;
        });
        setLikedSongs(restored);
      }
    }).catch(console.error);
  }, []);

  const toggleLike = (song: Song) => {
    setLikedSongs(prev => {
      const isCurrentlyLiked = prev.some(s => s.id === song.id);
      let newLiked;
      if (isCurrentlyLiked) {
        newLiked = prev.filter(s => s.id !== song.id);
      } else {
        newLiked = [...prev, song];
      }
      localforage.setItem('liked_songs', newLiked).catch(console.error);
      return newLiked;
    });
  };

  const isLiked = (songId: string) => likedSongs.some(s => s.id === songId);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.pause();
      }
    };
  }, []);

  const playSong = (song: Song, playlist?: Playlist) => {
    if (playlist) {
      setCurrentPlaylist(playlist);
    }
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  const togglePlayPause = () => {
    if (!currentSong || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentPlaylist || !currentSong) return;
    
    const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
      playSong(currentPlaylist.songs[nextIndex], currentPlaylist);
    }
  };

  const playPrevious = () => {
    if (!currentPlaylist || !currentSong) return;
    
    const currentIndex = currentPlaylist.songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
      playSong(currentPlaylist.songs[prevIndex], currentPlaylist);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentPlaylist,
        isPlaying,
        volume,
        progress,
        duration,
        likedSongs,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        setVolume,
        seek,
        toggleLike,
        isLiked,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
