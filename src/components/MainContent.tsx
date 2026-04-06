import React from 'react';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { Play } from 'lucide-react';

interface MainContentProps {
  currentView: string;
}

export const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const { playSong } = usePlayer();

  if (currentView === 'search') {
    return (
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-2xl mb-8">
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {['Pop', 'Hip-Hop', 'Rock', 'Latin', 'Podcast', 'Mood', 'Indie', 'Workout'].map((genre, i) => (
            <div key={genre} className={`aspect-square rounded-xl p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`} style={{ backgroundColor: \`hsl(\${i * 45}, 70%, 40%)\` }}>
              <span className="text-white font-bold text-xl">{genre}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'library') {
    return (
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6">Your Library</h2>
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
    <div className="flex-1 overflow-y-auto p-8 relative z-10">
      <h2 className="text-3xl font-bold text-white mb-6">Good evening</h2>
      
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

      <h2 className="text-2xl font-bold text-white mb-6 hover:underline cursor-pointer">Recently played</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
        {MOCK_SONGS.slice(0, 5).map((song) => (
          <div key={song.id} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-colors cursor-pointer group">
            <div className="relative mb-4">
              <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded-md shadow-lg" />
              <button 
                onClick={(e) => { e.stopPropagation(); playSong(song); }}
                className="absolute bottom-2 right-2 w-12 h-12 bg-[#ff4e00] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl"
              >
                <Play className="w-6 h-6 ml-1" />
              </button>
            </div>
            <h3 className="text-white font-bold truncate">{song.title}</h3>
            <p className="text-gray-400 text-sm mt-1 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-6 hover:underline cursor-pointer">Made for you</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
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
};
