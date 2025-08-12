"use client";

import { useState, useEffect } from "react";
import AudioVisualizer from "@/components/AudioVisualizer";
import SpotifyIntegration from "@/components/SpotifyIntegration";

export default function Home() {
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <AudioVisualizer
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
      />

      {/* Audio Source Selector and Spotify Auth */}
      <div
        className={`absolute bottom-4 z-10 space-y-4 transition-opacity duration-300 ${
          isFullscreen ? "opacity-0 hover:opacity-100" : ""
        } w-full px-4 md:w-auto md:px-0 md:right-4`}
      >
        <SpotifyIntegration />
      </div>
    </div>
  );
}
