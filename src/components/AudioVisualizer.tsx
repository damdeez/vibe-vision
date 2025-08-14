"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AudioVisualizerProps {
  audioSource?: "microphone" | "spotify";
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

type VisualizationMode = "spectrum" | "oscilloscope" | "bars" | "particles";

const AudioVisualizer = ({
  audioSource = "microphone",
  isFullscreen = false,
  onFullscreenToggle,
}: AudioVisualizerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [visualizationMode, setVisualizationMode] =
    useState<VisualizationMode>("spectrum");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus("granted");
      setupAudioAnalysis(stream);
      setIsListening(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Microphone access denied");
      setPermissionStatus("denied");
    }
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(new ArrayBuffer(bufferLength));
    const timeData = new Uint8Array(new ArrayBuffer(analyser.fftSize));

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    timeDataRef.current = timeData;
  };

  const drawSpectrum = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      dataArray: Uint8Array,
      width: number,
      height: number
    ) => {
      const barWidth = width / dataArray.length;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, "#00ff00");
      gradient.addColorStop(0.5, "#ffff00");
      gradient.addColorStop(1, "#ff0000");

      ctx.fillStyle = gradient;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8;
        const x = i * barWidth;
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }
    },
    []
  );

  const drawOscilloscope = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      timeData: Uint8Array,
      width: number,
      height: number
    ) => {
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = width / timeData.length;
      let x = 0;

      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    },
    []
  );

  const drawBars = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      dataArray: Uint8Array,
      width: number,
      height: number
    ) => {
      const barCount = 64;
      const barWidth = width / barCount;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const barHeight = (dataArray[dataIndex] / 255) * (height / 2) * 0.8;

        const hue = (i / barCount) * 360 + ((Date.now() * 0.05) % 360);
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

        const angle = (i / barCount) * Math.PI * 2;
        const radius = 100;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillRect(-barWidth / 2, 0, barWidth, barHeight);
        ctx.restore();
      }
    },
    []
  );

  const drawParticles = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      dataArray: Uint8Array,
      width: number,
      height: number
    ) => {
      const particleCount = 128;

      for (let i = 0; i < particleCount; i++) {
        const dataIndex = Math.floor((i / particleCount) * dataArray.length);
        const intensity = dataArray[dataIndex] / 255;

        if (intensity > 0.1) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = intensity * 8 + 1;

          const hue = (i / particleCount) * 360 + ((Date.now() * 0.1) % 360);
          ctx.fillStyle = `hsl(${hue}, 100%, ${50 + intensity * 50}%)`;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = size * 2;
          ctx.shadowColor = String(ctx.fillStyle);
        }
      }
      ctx.shadowBlur = 0;
    },
    []
  );

  const animate = useCallback(() => {
    if (
      !isListening ||
      !analyserRef.current ||
      !dataArrayRef.current ||
      !timeDataRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    analyserRef.current.getByteFrequencyData(
      dataArrayRef.current as Uint8Array<ArrayBuffer>
    );
    analyserRef.current.getByteTimeDomainData(
      timeDataRef.current as Uint8Array<ArrayBuffer>
    );

    // Clear canvas completely for clean mode switching, use fade for particles mode
    if (visualizationMode === "particles") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    switch (visualizationMode) {
      case "spectrum":
        drawSpectrum(ctx, dataArrayRef.current, canvas.width, canvas.height);
        break;
      case "oscilloscope":
        drawOscilloscope(ctx, timeDataRef.current, canvas.width, canvas.height);
        break;
      case "bars":
        drawBars(ctx, dataArrayRef.current, canvas.width, canvas.height);
        break;
      case "particles":
        drawParticles(ctx, dataArrayRef.current, canvas.width, canvas.height);
        break;
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [
    isListening,
    visualizationMode,
    drawSpectrum,
    drawOscilloscope,
    drawBars,
    drawParticles,
  ]);

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setIsListening(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      animate();
    }
  }, [isListening, animate]);

  // Clear canvas immediately when switching visualization modes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Force clear canvas when mode changes
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [visualizationMode]);

  return (
    <section
      className={`relative w-full h-screen bg-black overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      suppressHydrationWarning
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        suppressHydrationWarning
      />

      <div
        className={`absolute top-4 left-4 z-10 space-y-4 transition-opacity duration-300 ${
          isFullscreen ? "opacity-0 hover:opacity-100" : ""
        }`}
      >
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <div
                className="font-bold text-3xl sm:text-4xl tracking-wider transform -skew-x-12"
                style={{
                  fontFamily: "Impact, Arial Black, sans-serif",
                  textShadow: "2px 2px 0px #474747, 4px 4px 0px #111",
                  background: "linear-gradient(145deg, #fff, #ddd, #aaa, #888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "0.1em",
                }}
              >
                VIBE VISION
              </div>

              {/* Lightning bolt accent */}
              <div className="text-lg">⚡</div>
            </div>
          </div>

          {audioSource === "microphone" && (
            <div className="space-y-2">
              {permissionStatus === "prompt" && (
                <button
                  onClick={requestMicrophonePermission}
                  className="w-full px-3 py-2 border rounded-lg transition-colors text-sm cursor-pointer hover:opacity-80"
                >
                  🎤 Enable Microphone
                </button>
              )}

              {permissionStatus === "granted" && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isListening
                          ? "bg-red-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="text-xs">
                      {isListening ? "Listening..." : "Ready to listen"}
                    </span>
                  </div>

                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm cursor-pointer"
                    >
                      ⏹️ Stop
                    </button>
                  ) : (
                    <button
                      onClick={requestMicrophonePermission}
                      className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm cursor-pointer"
                    >
                      ▶️ Start Listening
                    </button>
                  )}
                </div>
              )}

              {permissionStatus === "denied" && (
                <div className="text-red-400 text-xs">
                  Microphone access denied. Please enable permissions in browser
                  settings.
                </div>
              )}

              {errorMsg && (
                <div className="text-red-400 text-md mx-2">{errorMsg}</div>
              )}
            </div>
          )}
        </div>

        {/* Visualization Mode Selector */}
        {isListening && (
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white max-w-xs">
            <h3 className="text-xs font-bold mb-2 text-green-400">
              Visualization Mode
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["spectrum", "oscilloscope", "bars", "particles"] as const).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => setVisualizationMode(mode)}
                    className={`px-2 py-1 rounded text-xs transition-colors capitalize cursor-pointer ${
                      visualizationMode === mode
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {/* Fullscreen Toggle */}
      {onFullscreenToggle && (
        <button
          onClick={onFullscreenToggle}
          className="absolute right-4 top-6 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white hover:bg-gray-800 transition-colors cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <div className="flex content-center items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
              <p className="text-sm">ESC</p>
            </div>
          ) : (
            <div className="flex content-center items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              <p className="text-sm">Fullscreen</p>
            </div>
          )}
        </button>
      )}
    </section>
  );
};

export default AudioVisualizer;
