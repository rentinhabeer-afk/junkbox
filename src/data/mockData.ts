export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'Neon Dreams',
    album: 'Synthwave Nights',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: '2',
    title: 'Ocean Breeze',
    artist: 'Chill Vibes',
    album: 'Summer Lo-Fi',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: '3',
    title: 'Neon Lights',
    artist: 'Cyber Punk',
    album: 'Future Sounds',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 344,
  },
  {
    id: '4',
    title: 'Acoustic Sunrise',
    artist: 'The Woodsmen',
    album: 'Morning Coffee',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
  },
  {
    id: '5',
    title: 'Deep Space',
    artist: 'Astro',
    album: 'Galactic',
    coverUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 353,
  },
  {
    id: '6',
    title: 'Urban Rhythm',
    artist: 'City Beats',
    album: 'Downtown',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 285,
  },
  {
    id: '7',
    title: 'Mountain Echoes',
    artist: 'Nature Sounds',
    album: 'Wilderness',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 410,
  },
  {
    id: '8',
    title: 'Electric Dreams',
    artist: 'Synth Pop',
    album: '80s Revival',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 330,
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [];
