// Spotify API Types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  preview_url: string | null;
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number;
}

export interface SpotifyAudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  loudness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: {
    total: number;
  };
  images: Array<{ url: string }>;
}

export interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
}

// Spotify API endpoints and utilities
export const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const spotifyEndpoints = {
  currentlyPlaying: "/me/player/currently-playing",
  audioFeatures: (trackId: string) => `/audio-features/${trackId}`,
  userPlaylists: "/me/playlists",
} as const;

export function createSpotifyHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}
