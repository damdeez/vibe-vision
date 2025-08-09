'use client';

import { useState, useEffect } from 'react';
import AudioVisualizer from '@/components/AudioVisualizer';
import SpotifyIntegration from '@/components/SpotifyIntegration';

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

      {/* Audio Source Selector and Spotify Auth */}
      <div
        className={`absolute bottom-4 z-10 space-y-4 transition-opacity duration-300 ${
          isFullscreen ? "opacity-0 hover:opacity-100" : ""
        } w-full px-4 md:w-auto md:px-0 md:right-4`}
      >
        {/* <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white w-full md:max-w-xs">
          <h3 className="text-lg font-bold mb-3">Audio Source</h3>
          <div className="space-y-2">
            <button
              onClick={() => setAudioSource("microphone")}
              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                audioSource === "microphone"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              🎤 Microphone
            </button>
            <button
              onClick={() => setAudioSource("spotify")}
              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                audioSource === "spotify"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              🎵 Spotify
            </button>
          </div>
        </div> */}

        <SpotifyIntegration />
      </div>
    </div>
  );
}
