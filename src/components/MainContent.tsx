import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { Play, Folder, FileAudio, Upload, Loader2, Heart } from 'lucide-react';
import localforage from 'localforage';

interface MainContentProps {
  currentView: string;
}

export const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const { playSong, likedSongs } = usePlayer();
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localforage.getItem<any[]>('local_files').then((files) => {
      if (files) {
        const restored = files.map(f => {
          if (f.fileObj) {
            return { ...f, audioUrl: URL.createObjectURL(f.fileObj) };
          }
          return f;
        });
        setLocalFiles(restored);
      }
    }).catch(console.error);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      alert("Por favor, selecione arquivos de áudio válidos (.mp3, .wav, etc).");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    const newSongs: any[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const objectUrl = URL.createObjectURL(file);
      const songId = `local_${file.name}_${file.size}`;
      
      if (localFiles.some(s => s.id === songId)) continue;

      newSongs.push({
        id: songId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Arquivo Local',
        album: 'Meu Aparelho',
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop',
        audioUrl: objectUrl,
        duration: 0,
        fileObj: file
      });

      setProcessProgress(Math.round(((i + 1) / validFiles.length) * 100));
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    setLocalFiles((prev) => {
      const updated = [...prev, ...newSongs];
      localforage.setItem('local_files', updated).catch(console.error);
      return updated;
    });
    
    setIsProcessing(false);
    setProcessProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (currentView === 'local' || currentView === 'drive') {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">Músicas do Aparelho</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center mb-8">
          <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-white mb-2">Ouça as músicas salvas no seu aparelho</p>
          <p className="text-sm text-gray-400 mb-6">
            Selecione os arquivos de áudio da sua memória local.<br/>
            <span className="text-[#ff4e00] font-medium mt-2 block">Dica: Pressione e segure uma música para selecionar várias de uma vez.</span>
          </p>
          
          <input 
            type="file" 
            accept="*/*" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={`px-6 py-3 bg-[#ff4e00] text-white font-medium rounded-full transition-transform flex items-center justify-center gap-2 mx-auto ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adicionando... {processProgress}%
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Adicionar Músicas
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {localFiles.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Nenhuma música adicionada ainda.
            </div>
          ) : (
            localFiles.map((file) => (
              <div 
                key={file.id}
                onClick={() => playSong(file, { id: 'local', name: 'Meus Arquivos', description: '', coverUrl: '', songs: localFiles })}
                className="flex items-center gap-4 p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#ff4e00] transition-colors">
                  <Play className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white font-medium truncate">{file.title}</p>
                  <p className="text-gray-400 text-xs">Arquivo Local</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'search') {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative z-10">
        <div className="max-w-2xl mb-8">
          <input 
            type="text" 
            placeholder="O que você quer ouvir?" 
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Navegar por tudo</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {['Pop', 'Hip-Hop', 'Rock', 'Latina', 'Podcast', 'Eletrônica', 'Indie', 'Jazz'].map((genre, i) => (
            <div key={genre} className={`aspect-square rounded-xl p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`} style={{ backgroundColor: `hsl(${i * 45}, 70%, 40%)` }}>
              <span className="text-white font-bold text-xl">{genre}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'library') {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Músicas Curtidas</h2>
            <p className="text-gray-400 mt-1">{likedSongs.length} músicas</p>
          </div>
        </div>

        <div className="space-y-2">
          {likedSongs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Você ainda não curtiu nenhuma música.
            </div>
          ) : (
            likedSongs.map((song) => (
              <div 
                key={song.id}
                onClick={() => playSong(song, { id: 'liked', name: 'Músicas Curtidas', description: '', coverUrl: '', songs: likedSongs })}
                className="flex items-center gap-4 p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#ff4e00] transition-colors relative overflow-hidden">
                  <img src={song.coverUrl} alt={song.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />
                  <Play className="w-5 h-5 relative z-10" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white font-medium truncate">{song.title}</p>
                  <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                </div>
                <Heart className="w-5 h-5 text-[#ff4e00] fill-[#ff4e00]" />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 md:pb-8 relative z-10">
      {/* Banner / Wallpaper Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000&auto=format&fit=crop" 
          alt="Wallpaper" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex items-end justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4e00] to-pink-600 flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
                William
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl font-medium ml-1">
              Sua trilha sonora pessoal
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {MOCK_PLAYLISTS.slice(0, 6).map((playlist) => (
            <div 
              key={playlist.id} 
              className="flex items-center bg-white/5 hover:bg-white/20 transition-colors rounded-md overflow-hidden cursor-pointer group"
            >
              <img src={playlist.coverUrl} alt={playlist.name} className="w-20 h-20 object-cover shadow-md" />
              <span className="text-white font-bold ml-4 flex-1">{playlist.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); playSong(playlist.songs[0], playlist); }}
                className="w-12 h-12 bg-[#ff4e00] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl mr-4"
              >
                <Play className="w-6 h-6 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
