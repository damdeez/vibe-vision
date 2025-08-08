'use client';

import { useState, useEffect } from 'react';
import AudioVisualizer from '@/components/AudioVisualizer';
import SpotifyLogin from '@/components/SpotifyLogin';

export default function Home() {
  const [audioSource, setAudioSource] = useState<'microphone' | 'spotify'>('microphone');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <AudioVisualizer 
        audioSource={audioSource} 
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
      />
      
      <div className={`absolute top-4 right-4 z-10 space-y-4 transition-opacity duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100' : ''}`}>
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white border border-gray-700">
          <h3 className="text-lg font-bold mb-3 text-green-400">Audio Source</h3>
          <div className="space-y-2">
            <button
              onClick={() => setAudioSource('microphone')}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                audioSource === 'microphone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              🎤 Microphone
            </button>
            <button
              onClick={() => setAudioSource('spotify')}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                audioSource === 'spotify'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              🎵 Spotify
            </button>
          </div>
        </div>
        
        <SpotifyLogin />
      </div>
    </div>
  );
}
