/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { MainContent } from './components/MainContent';
import { PlayerProvider } from './context/PlayerContext';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <PlayerProvider>
      <div className="h-screen w-full bg-[#0a0502] text-white overflow-hidden flex flex-col font-sans relative">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%)] opacity-80 blur-[60px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_50%)] opacity-40 blur-[60px]"></div>
        </div>

        <div className="flex-1 flex overflow-hidden relative z-10">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <MainContent currentView={currentView} />
        </div>
        
        <Player />
      </div>
    </PlayerProvider>
  );
}
