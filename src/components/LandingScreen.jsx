import { motion } from 'framer-motion';
import LyricsBackground from './LyricsBackground';

export default function LandingScreen({ onPlay }) {
  return (
    <motion.div
      className="landing-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <LyricsBackground />
      
      <div className="landing-content">
        <motion.div
          className="landing-hearts"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="heart-icon">💕</span>
        </motion.div>
        
        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          For My Sana
        </motion.h1>
        
        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Put on your headphones
        </motion.p>
        
        <motion.button
          className="play-button"
          onClick={onPlay}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="play-icon">▶</span>
          <span>Play Our Song</span>
        </motion.button>
        
        <motion.p
          className="landing-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          A journey through our memories
        </motion.p>
      </div>
    </motion.div>
  );
}
