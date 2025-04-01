import { motion } from 'framer-motion';
import { MoodType, MoodResponse } from '../types';

interface MoodResponseProps {
  mood: MoodType;
  response: MoodResponse;
}

export function MoodResponseCard({ mood, response }: MoodResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-8 rounded-2xl ${response.color} shadow-xl max-w-md w-full text-center`}
    >
      <h2 className="text-2xl font-bold mb-4 capitalize">
        {mood}
      </h2>
      <p className="text-lg mb-4">{response.message}</p>
      <p className="text-lg mb-4 italic">{response.joke}</p>
      <motion.p
        animate={{
          x: [0, 10, -10, 0],
          transition: { repeat: Infinity, duration: 2 }
        }}
        className="text-lg font-bold text-purple-700"
      >
        {response.action}
      </motion.p>
    </motion.div>
  );
}