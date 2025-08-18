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
    <main className="relative w-full h-screen">
      <AudioVisualizer
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
      />
      <SpotifyIntegration isFullscreen={isFullscreen} />
    </main>
  );
}
