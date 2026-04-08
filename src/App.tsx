/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { MainContent } from './components/MainContent';
import { PlayerProvider } from './context/PlayerContext';
import { Home, Library, Folder } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <PlayerProvider>
      <div className="h-[100dvh] w-full bg-[#0a0502] text-white overflow-hidden flex flex-col font-sans relative">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%)] opacity-80 blur-[60px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_50%)] opacity-40 blur-[60px]"></div>
        </div>

        <div className="flex-1 flex overflow-hidden relative z-10">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <MainContent currentView={currentView} />
        </div>
        
        <div className="flex flex-col z-50 relative">
          <Player />
          
          {/* Mobile Bottom Nav */}
          <div className="md:hidden bg-[#0a0502]/95 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center p-2 pb-4">
            <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'home' ? 'text-white' : 'text-gray-400'}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Início</span>
            </button>
            <button onClick={() => setCurrentView('library')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'library' ? 'text-white' : 'text-gray-400'}`}>
              <Library className="w-6 h-6" />
              <span className="text-[10px] font-medium">Biblioteca</span>
            </button>
            <button onClick={() => setCurrentView('local')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'local' ? 'text-white' : 'text-gray-400'}`}>
              <Folder className="w-6 h-6" />
              <span className="text-[10px] font-medium">Arquivos</span>
            </button>
          </div>
        </div>
      </div>
    </PlayerProvider>
  );
}
