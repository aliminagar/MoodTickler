import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { MoodType, MoodResponse } from '../types';

interface MoodResponseProps {
  mood: MoodType;
  data: MoodResponse | undefined;
}

export function MoodResponseCard({ mood, data }: MoodResponseProps) {
  const controls = useAnimation();

  useEffect(() => {
    const playAnimation = async () => {
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 },
      });
    };

    playAnimation();
  }, [mood, controls]);

  if (!data) {
    return (
      <div className="p-8 rounded-2xl w-full max-w-md mx-auto text-center backdrop-blur-md bg-white/30 border border-white/30 shadow-xl text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`mood-card ${mood} w-full max-w-md mx-auto text-center relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card-inner">
        {/* Front Side */}
        <div className="card-face card-front flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {/* Emoji Inside the Box */}
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {data.emoji}
          </motion.div>

          {/* Selected Mood Word */}
          <p className="text-lg text-white drop-shadow-md capitalize">
            {mood}
          </p>
        </div>

        {/* Back Side */}
        <motion.div
          animate={controls}
          className="card-face card-back flex flex-col items-center p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 gap-4"
        >
          <motion.p
            className="text-lg text-white drop-shadow-md bg-white/40 p-4 rounded-xl"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {data.message}
          </motion.p>

          <p className="text-lg italic text-white drop-shadow-md bg-white/40 p-4 rounded-xl hover:bg-white/50 transition-colors duration-200">
            {data.joke}
          </p>

          <motion.p
            animate={{
              x: [0, 10, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-lg font-bold text-white drop-shadow-md bg-white/40 p-3 rounded-lg inline-block shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {data.action}
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ✨
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}