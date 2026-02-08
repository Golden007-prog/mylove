import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Time offset (0 = exact sync with CSV timestamps)
const TIME_OFFSET = 0;

// Video lyrics from Start-VocalDuration-Content.csv
// 0:20 (11s) → 0:31 (11s) → 0:42 (16s) → ends at 0:58
const videoLyrics = [
  { time: 20, text: "I found a love for me... Darling, just dive right in and follow my lead" },
  { time: 36, text: "Well, I found a girl, beautiful and sweet... Oh, I never knew you were the someone waiting for me" },
  { time: 49, text: "Cause we were just kids when we fell in love... Not knowing what it was" },
];

export default function LyricsOverlay({ currentTime, isActive }) {
  const [currentLyric, setCurrentLyric] = useState('');
  const [lyricKey, setLyricKey] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentLyric('');
      return;
    }

    // Apply time offset so lyrics appear earlier
    const adjustedTime = currentTime - TIME_OFFSET;

    // Find the current lyric based on adjusted time
    let activeLyric = '';
    for (let i = videoLyrics.length - 1; i >= 0; i--) {
      if (adjustedTime >= videoLyrics[i].time) {
        activeLyric = videoLyrics[i].text;
        break;
      }
    }

    if (activeLyric !== currentLyric) {
      setCurrentLyric(activeLyric);
      setLyricKey(prev => prev + 1);
    }
  }, [currentTime, isActive, currentLyric]);

  if (!isActive) return null;

  return (
    <div className="lyrics-overlay">
      <AnimatePresence mode="wait">
        {currentLyric && (
          <motion.div
            key={lyricKey}
            className="lyric-line"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut",
              exit: { duration: 0.6, delay: 0.3 }
            }}
          >
            {currentLyric}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
