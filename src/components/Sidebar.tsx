import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, ListMusic, Folder } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'library', label: 'Sua Biblioteca', icon: Library },
    { id: 'local', label: 'Meus Arquivos', icon: Folder },
  ];

  return (
    <div className="hidden md:flex w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex-col h-full text-gray-300 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
          <ListMusic className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">William</h1>
      </div>

      <nav className="space-y-4 mb-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-4 w-full text-left transition-colors duration-200 ${
                isActive ? 'text-white font-medium' : 'hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-4 mb-6">
        <button className="flex items-center gap-4 w-full text-left hover:text-white transition-colors duration-200">
          <div className="w-6 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-black">
            <PlusSquare className="w-4 h-4" />
          </div>
          Criar Playlist
        </button>
        <button className="flex items-center gap-4 w-full text-left hover:text-white transition-colors duration-200">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm flex items-center justify-center text-white">
            <Heart className="w-4 h-4" />
          </div>
          Músicas Curtidas
        </button>
      </div>

      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Playlists</div>
        <div className="space-y-3 overflow-y-auto max-h-48 scrollbar-hide text-gray-500 text-sm">
          Nenhuma playlist criada.
        </div>
      </div>
    </div>
  );
};
