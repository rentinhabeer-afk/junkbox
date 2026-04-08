import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Play, Folder, FileAudio, Upload, Loader2, Trash2 } from 'lucide-react';

interface MainContentProps {
  currentView: string;
}

export const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const { playSong } = usePlayer();
  const { user, login } = useAuth();
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setLocalFiles([]);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/songs`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLocalFiles(songs);
    }, (error) => {
      console.error("Error fetching songs:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!user) {
      alert("Você precisa estar logado para salvar músicas na nuvem.");
      return;
    }

    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      alert("Por favor, selecione arquivos de áudio válidos (.mp3, .wav, etc).");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let completed = 0;

    for (const file of validFiles) {
      try {
        const fileRef = ref(storage, `users/${user.uid}/songs/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              // Optional: track individual progress
            }, 
            (error) => reject(error), 
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              await addDoc(collection(db, `users/${user.uid}/songs`), {
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Arquivo na Nuvem',
                album: 'Meu Aparelho',
                coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop',
                audioUrl: downloadURL,
                storagePath: fileRef.fullPath,
                duration: 0,
                createdAt: serverTimestamp()
              });
              resolve();
            }
          );
        });
        completed++;
        setUploadProgress(Math.round((completed / validFiles.length) * 100));
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        alert(`Erro ao fazer upload do arquivo ${file.name}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent, song: any) => {
    e.stopPropagation();
    if (!user || !song.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir "${song.title}"?`)) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/songs`, song.id));
        if (song.storagePath) {
          await deleteObject(ref(storage, song.storagePath));
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  if (currentView === 'local' || currentView === 'drive') {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">Músicas na Nuvem</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center mb-8">
          <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-white mb-2">Guarde suas músicas na nuvem</p>
          <p className="text-sm text-gray-400 mb-6">
            Faça upload dos seus arquivos de áudio para ouvir em qualquer dispositivo.<br/>
            <span className="text-[#ff4e00] font-medium mt-2 block">Dica: Pressione e segure uma música para selecionar várias de uma vez.</span>
          </p>
          
          <input 
            type="file" 
            accept="*/*" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={uploading}
          />
          
          {!user ? (
            <button 
              onClick={login}
              className="px-6 py-3 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform mx-auto"
            >
              Fazer Login com Google
            </button>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`px-6 py-3 bg-[#ff4e00] text-white font-medium rounded-full transition-transform flex items-center justify-center gap-2 mx-auto ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Fazer Upload de Músicas
                </>
              )}
            </button>
          )}
        </div>

        {user && (
          <div className="space-y-2">
            {localFiles.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                Nenhuma música na sua nuvem ainda.
              </div>
            ) : (
              localFiles.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => playSong(file)}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#ff4e00] transition-colors">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium truncate">{file.title}</p>
                    <p className="text-gray-400 text-xs">Salvo na Nuvem</p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, file)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
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
        <h2 className="text-3xl font-bold text-white mb-6">Sua Biblioteca</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {MOCK_PLAYLISTS.map((playlist) => (
            <div key={playlist.id} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-colors cursor-pointer group">
              <div className="relative mb-4">
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square object-cover rounded-md shadow-lg" />
                <button 
                  onClick={(e) => { e.stopPropagation(); playSong(playlist.songs[0], playlist); }}
                  className="absolute bottom-2 right-2 w-12 h-12 bg-[#ff4e00] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl"
                >
                  <Play className="w-6 h-6 ml-1" />
                </button>
              </div>
              <h3 className="text-white font-bold truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative z-10">
      <h2 className="text-3xl font-bold text-white mb-6">Boa noite</h2>
      
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
  );
};
