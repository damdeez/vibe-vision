import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'i.scdn.co', // Spotify images
      'mosaic.scdn.co', // Spotify playlist images
      'lineup-images.scdn.co', // Spotify artist images
      'thisis-images.scdn.co', // Spotify This Is playlists
      'mixed-media-images.scdn.co', // Spotify mixed content
      'scontent-lhr8-1.xx.fbcdn.net', // Facebook CDN
      'scontent.xx.fbcdn.net', // Facebook CDN alternative
      'platform-lookaside.fbsbx.com', // Facebook platform images
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
    ]
  }
};

export default nextConfig;
