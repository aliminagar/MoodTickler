// Updated App.tsx to restore the 3D dice while keeping reset behavior and enable mobile sound playback
import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MoodType, MoodStats as MoodStatsType } from './types';
import { moodResponses } from './moodData';
import { MoodButton } from './components/MoodButton';
import { MoodResponseCard } from './components/MoodResponseCard';
import MoodDice from './components/MoodDice';
import MoodEnvironment from './components/MoodEnvironment';
import { MoodStats } from './components/MoodStats';

function App() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodStats, setMoodStats] = useState<MoodStatsType[]>(() => {
    const saved = localStorage.getItem('moodStats');
    return saved ? JSON.parse(saved) : [];
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    { id: string; timestamp: number; x: number; y: number; emoji: string; color: string }[]
  >([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gridTilt, setGridTilt] = useState({ x: 0, y: 0 });
  const [diceResetKey, setDiceResetKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('moodStats', JSON.stringify(moodStats));
  }, [moodStats]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setGridTilt({ x, y });

      if (Math.random() > 0.7) {
        const emojis = ['😄', '😂', '🤓', '😎', '🥳', '😜'];
        const colors = ['#ff4d4d', '#4da8ff', '#ffd700', '#4dff4d', '#ff66cc', '#66ffcc'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const timestamp = Date.now();

        setParticles((prev) => [
          ...prev,
          { id: uniqueId, timestamp, x: e.clientX, y: e.clientY, emoji: randomEmoji, color: randomColor },
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.timestamp < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedMood) {
      setIsFlipped(false);
      setTimeout(() => setIsFlipped(true), 10);
    }
  }, [selectedMood]);

  const handleMoodSelect = (mood: MoodType) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    try {
      const soundEffect = moodResponses[mood].soundEffect;
      const baseUrl = import.meta.env.BASE_URL || '/';
      const audioPath = `${baseUrl}sounds/${soundEffect}.mp3`;

      const audio = new Audio(audioPath);
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Mobile playback failed:', error.message);
          audioRef.current = null;
        });
      }

      audio.addEventListener('ended', () => {
        if (audioRef.current === audio) audioRef.current = null;
      });

      audio.addEventListener('error', () => {
        if (audioRef.current === audio) audioRef.current = null;
      });

      setSelectedMood(mood);
      setMoodStats((prev) => [...prev, { mood, timestamp: new Date().toISOString() }]);
      setDiceResetKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const handleResetStats = () => {
    setMoodStats([]);
    localStorage.removeItem('moodStats');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setSelectedMood(null);
  };

  const handleStopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      console.log('Audio manually stopped');
    }
  };

  const moods = Object.keys(moodResponses) as MoodType[];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MoodEnvironment mood={selectedMood} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        {/* Spinning 3D Emoji Cube Cursor */}
        <div
          className="cube"
          style={{
            position: 'fixed',
            left: cursorPos.x - 15,
            top: cursorPos.y - 15,
            width: '30px',
            height: '30px',
            transformStyle: 'preserve-3d',
            animation: 'spin 4s infinite linear',
            zIndex: 20,
          }}
        >
          <div className="face front">😄</div>
          <div className="face back">😂</div>
          <div className="face right">🤓</div>
          <div className="face left">😎</div>
          <div className="face top">🥳</div>
          <div className="face bottom">😜</div>
        </div>
        <div className="relative flex flex-col items-center max-w-4xl w-full mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 mb-2 flex items-center gap-2 text-center animate-glow">
            <Sparkles className="w-8 h-8 text-blue-300 animate-pulse" />
            MoodTickler
            <Sparkles className="w-8 h-8 text-blue-300 animate-pulse" />
          </h1>
          <p className="text-lg text-white mb-8 text-center font-medium drop-shadow-lg max-w-2xl">
            How are you feeling today? Pick a mood and let's brighten your day!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 w-full backdrop-blur-sm bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
            {moods.map((mood) => (
              <MoodButton key={mood} mood={mood} moodData={moodResponses[mood]} onSelect={handleMoodSelect} />
            ))}
          </div>

          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '120px',
              zIndex: 15,
              textAlign: 'center',
              color: 'white',
              textShadow: '0 0 2px black',
              fontSize: '12px',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ width: '100%', height: '120px' }}>
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <MoodDice onRoll={handleMoodSelect} resetTrigger={diceResetKey} />
                <OrbitControls enablePan={false} minDistance={5} maxDistance={15} enableZoom={false} />
              </Canvas>
            </div>
            🎲 Click the dice to roll a mood!
          </div>

          <div className="w-full flex flex-col items-center gap-8">
            {selectedMood && moodResponses[selectedMood] ? (
              <div
                className={`response-card ${isFlipped ? 'flipped' : ''} backdrop-blur-md bg-gray-900/40 p-6 rounded-2xl border border-gray-700/50 shadow-lg`}
                style={{ perspective: '1000px' }}
              >
                <MoodResponseCard mood={selectedMood} data={moodResponses[selectedMood]} />
              </div>
            ) : (
              <p className="text-lg text-white text-center animate-bounce drop-shadow-lg backdrop-blur-sm bg-gray-900/30 p-4 rounded-xl">
                Pick a mood to get tickled with laughter! 😄
              </p>
            )}

            <MoodStats
              stats={moodStats}
              onReset={handleResetStats}
              onStopSound={handleStopSound}
              isSoundPlaying={!!audioRef.current}
            />

            <footer className="mt-8 p-4 w-full text-center backdrop-blur-sm bg-gray-900/50 rounded-lg border border-gray-700/50">
              <p className="text-gray-300 text-sm font-medium drop-shadow-lg animate-glow">
                Created by Alireza Minagar in March 2025
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
