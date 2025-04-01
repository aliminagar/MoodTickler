// src/components/MoodButton.tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { MoodType, MoodResponse } from '../types';

interface MoodButtonProps {
  mood: MoodType;
  moodData: MoodResponse;
  onSelect: (mood: MoodType) => void;
}

export function MoodButton({ mood, moodData, onSelect }: MoodButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse position to rotation angles for 3D tilt
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]); // Tilt up/down
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]); // Tilt left/right

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = (e.clientX - centerX) / rect.width;
      const mouseY = (e.clientY - centerY) / rect.height;

      // Update motion values for rotation
      x.set(mouseX);
      y.set(mouseY);
    };

    const handleMouseLeave = () => {
      // Reset rotation when mouse leaves
      x.set(0);
      y.set(0);
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (button) {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [x, y]);

  return (
    <motion.button
      ref={buttonRef}
      style={{
        perspective: '500px',
        rotateX,
        rotateY,
        translateZ: 10, // Initial 3D lift
      }}
      whileHover={{
        scale: 1.1,
        rotate: [-1, 1, -1],
        translateZ: 20, // Lift more on hover
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(mood)}
      className={`mood-button ${mood} p-6 rounded-xl ${moodData.color} shadow-lg transition-all duration-300 
        hover:shadow-xl hover:shadow-purple-500/20 backdrop-blur-sm bg-opacity-90 
        relative overflow-hidden group`}
      aria-label={`${mood} mood`}
    >
      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-transparent"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Emoji with animation */}
      <motion.span
        className="text-4xl filter drop-shadow-md relative z-10 inline-block"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        role="img"
        aria-label={mood}
      >
        {moodData.emoji}
      </motion.span>

      {/* Hover effect particles */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ✨
      </motion.div>
    </motion.button>
  );
}