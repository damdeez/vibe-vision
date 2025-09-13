"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useFetchWrapper } from "@/hooks/useFetchWrapper";
import { 
  SpotifyCurrentlyPlaying, 
  SPOTIFY_API_BASE, 
  spotifyEndpoints, 
  createSpotifyHeaders 
} from "@/services/spotify";

// Type extensions are in src/types/next-auth.d.ts

interface ExtendedSession {
  accessToken?: string;
  error?: string;
  expires: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

function isExtendedSession(
  session: ReturnType<typeof useSession>["data"]
): session is ExtendedSession {
  return session !== null && session !== undefined && "accessToken" in session;
}

interface CurrentTrack {
  name: string;
  artist: string;
  album: string;
  image: string;
  isPlaying: boolean;
}

const SpotifyIntegration = ({ isFullscreen }: { isFullscreen: boolean }) => {
  const { data: session, status } = useSession();
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [error, setError] = useState<string>("");

  // Use useFetchWrapper for fetching currently playing track
  const { data: currentlyPlaying, error: fetchError, refetch } = useFetchWrapper<SpotifyCurrentlyPlaying | null>(
    spotifyEndpoints.currentlyPlaying,
    {
      headers: isExtendedSession(session) ? createSpotifyHeaders(session.accessToken!) : undefined,
    },
    {
      immediate: false, // We'll trigger this manually
      baseURL: SPOTIFY_API_BASE,
    }
  );

  useEffect(() => {
    if (!isExtendedSession(session)) {
      return;
    }

    const accessToken = session.accessToken;
    const sessionError = session.error;

    if (sessionError === "RefreshAccessTokenError") {
      setError("Session expired. Please reconnect your Spotify account.");
      return;
    }

    if (accessToken) {
      setError("");
      
      const fetchCurrentTrack = async () => {
        try {
          await refetch();
        } catch (err) {
          setError("Failed to fetch current track");
          console.error(err);
        }
      };

      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 20000);

      return () => clearInterval(interval);
    }
  }, [session, refetch]);

  // Update currentTrack when data changes
  useEffect(() => {
    if (fetchError) {
      setError("Failed to fetch current track");
      return;
    }

    if (currentlyPlaying && currentlyPlaying.item) {
      setCurrentTrack({
        name: currentlyPlaying.item.name,
        artist: currentlyPlaying.item.artists
          .map((a) => a.name)
          .join(", "),
        album: currentlyPlaying.item.album.name,
        image: currentlyPlaying.item.album.images[0]?.url || "",
        isPlaying: currentlyPlaying.is_playing,
      });
    } else {
      setCurrentTrack(null);
    }
  }, [currentlyPlaying, fetchError]);

  const handleSignIn = () => {
    signIn("spotify");
  };

  const handleSignOut = () => {
    signOut();
    setCurrentTrack(null);
  };

  if (status === "loading") {
    return (
      <section
        className={`absolute bottom-4 z-10 space-y-4 transition-opacity duration-300 ${
          isFullscreen ? "opacity-0 hover:opacity-100" : ""
        } w-full md:w-auto md:px-0 md:right-4 bg-black/50 backdrop-blur-sm rounded-lg text-white space-y-4 w-full md:max-w-xs`}
      >
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  return (
    <section
      className={`absolute bottom-4 z-10 space-y-4 transition-opacity duration-300 ${
        isFullscreen ? "opacity-0 hover:opacity-100" : ""
      } w-full md:w-auto md:px-0 md:right-4 bg-black/50 backdrop-blur-sm rounded-lg text-white space-y-4 w-full md:max-w-xs`}
    >
      {/* <h3 className="text-lg font-bold">Spotify</h3> */}

      {!session ? (
        <div className="space-y-3 p-4">
          <p className="text-sm text-gray-300">
            Connect your Spotify account and enable the microphone to visualize
            your currently playing music
          </p>
          <button
            onClick={handleSignIn}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>Connect Spotify</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <div className="truncate text-sm w-32">
                  {session.user?.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          {currentTrack ? (
            <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentTrack.isPlaying
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs font-medium">
                  {currentTrack.isPlaying ? "Now Playing" : "Paused"}
                </span>
              </div>
              <div className="flex space-x-3">
                {currentTrack.image && (
                  <Image
                    src={currentTrack.image}
                    alt={`${currentTrack.album} cover`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentTrack.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentTrack.artist}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentTrack.album}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 text-center py-3">
              No track currently playing
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SpotifyIntegration;
