# 🎵 Vibe Vision

**See your music come alive with interactive audio visualizations**

A modern web app that transforms audio into stunning real-time visualizations, featuring classic Winamp-style effects with microphone and Spotify integration.

## ✨ Features

### 🎤 **Dual Audio Sources**
- **Microphone Input**: Visualize ambient sound and music in real-time
- **Spotify Integration**: Connect your Spotify account to visualize currently playing tracks

### 🎨 **4 Visualization Modes**
- **Spectrum Analyzer**: Classic frequency bars with green-yellow-red gradient
- **Oscilloscope**: Real-time waveform display showing audio signal shape  
- **Circular Bars**: Rotating frequency bars arranged in a circle with color cycling
- **Particles**: Dynamic particle system that responds to audio intensity

### 🖥️ **Immersive Experience**
- **Fullscreen Mode**: True fullscreen experience for parties and events
- **Auto-hiding Controls**: Clean interface that fades in fullscreen
- **Responsive Design**: Works on any screen size
- **60fps Performance**: Smooth canvas-based rendering

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Web Audio API** - Real-time audio analysis
- **NextAuth.js** - Spotify authentication
- **Canvas API** - High-performance visualizations

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- A Spotify Developer Account (for Spotify integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vibe-vision.git
   cd vibe-vision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify App** (optional)
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://127.0.0.1:3001/api/auth/callback/spotify` to redirect URIs
   - Copy your Client ID and Client Secret

4. **Environment Variables**
   Create `.env.local`:
   ```env
   # Spotify API Configuration
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

   # NextAuth Configuration  
   NEXTAUTH_URL=http://127.0.0.1:3001
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://127.0.0.1:3001` (note: use 127.0.0.1, not localhost for Spotify auth)

## 🎮 Usage

1. **Enable Microphone**: Click "Enable Microphone" to start visualizing ambient audio
2. **Connect Spotify**: Login with your Spotify account to see currently playing tracks  
3. **Switch Modes**: Try different visualization modes (Spectrum, Oscilloscope, Bars, Particles)
4. **Go Fullscreen**: Click the fullscreen button for an immersive experience
5. **Switch Audio Sources**: Toggle between microphone and Spotify as your audio source

## 🎨 Visualization Modes

- **Spectrum**: Classic frequency analyzer with color gradients
- **Oscilloscope**: Waveform display showing signal amplitude over time
- **Bars**: Circular frequency bars with rotating camera and color cycling
- **Particles**: Dynamic particles that react to audio intensity and frequency

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production  
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎯 Features Roadmap

- [ ] More visualization modes (waveform, 3D spectrum)
- [ ] Audio effects and filters
- [ ] Recording and sharing visualizations
- [ ] Playlist integration
- [ ] Customizable color themes
- [ ] Performance optimizations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by classic Winamp visualizations
- Built with modern web technologies
- Thanks to the Web Audio API and Canvas API communities

---

**Enjoy the show! 🎵✨**
