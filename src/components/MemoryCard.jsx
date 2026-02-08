import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function MemoryCard({ lyric, photo, index, isVisible, type = 'photo' }) {
  const [isInCenter, setIsInCenter] = useState(false);
  const cardRef = useRef(null);

  // Check if card is near center of viewport
  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInCenter(entry.intersectionRatio > 0.5);
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Randomize float animation parameters
  const floatY = 8 + (index % 3) * 4;
  const floatDuration = 3 + (index % 2);
  const rotateAmount = 1 + (index % 3);
  const delay = (index % 5) * 0.2;
  const baseRotation = (index % 2 === 0 ? -2 : 2) + (index % 3);

  // Render lyric-only card
  if (type === 'lyric') {
    return (
      <motion.div
        ref={cardRef}
        className="memory-card"
        initial={{ opacity: 0, y: 120, scale: 0.9 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 120, scale: 0.9 }}
        transition={{ duration: index === 0 ? 0.2 : 0.4, delay: 0 }}
        style={{ transform: `rotate(${baseRotation}deg)` }}
      >
        <motion.div
          className="memory-card-float"
          animate={{
            y: [-floatY, floatY, -floatY],
            rotate: [-rotateAmount, rotateAmount, -rotateAmount],
          }}
          transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <div className="lyric-card-inner">
            <span className="tape-corner top-left" />
            <span className="tape-corner top-right" />
            <p className="memory-lyric">{lyric}</p>
            <span className="card-heart" style={{ bottom: '10px', right: '15px' }}>♥</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Render sticky note style
  if (type === 'sticky') {
    return (
      <motion.div
        ref={cardRef}
        className="memory-card"
        initial={{ opacity: 0, y: 120, scale: 0.9, rotate: -3 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotate: baseRotation } : { opacity: 0, y: 120, scale: 0.9 }}
        transition={{ duration: index === 0 ? 0.2 : 0.4, delay: 0 }}
      >
        <motion.div
          className="memory-card-float"
          animate={{
            y: [-floatY, floatY, -floatY],
            rotate: [-rotateAmount, rotateAmount, -rotateAmount],
          }}
          transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <div className="memory-card-inner sticky-note">
            {photo && (
              <div className="memory-photo-wrapper">
                <img src={photo} alt="Memory" className="memory-photo" loading="lazy" />
              </div>
            )}
            <p className="memory-lyric">{lyric}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Default: photo card with tape corners
  return (
    <motion.div
      ref={cardRef}
      className="memory-card"
      initial={{ opacity: 0, y: 120, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 120, scale: 0.9 }}
      transition={{ duration: index === 0 ? 0.2 : 0.4, delay: 0 }}
      style={{ transform: `rotate(${baseRotation}deg)` }}
    >
      <motion.div
        className="memory-card-float"
        animate={{
          y: [-floatY, floatY, -floatY],
          rotate: [-rotateAmount, rotateAmount, -rotateAmount],
        }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <div className="memory-card-inner">
          <span className="tape-corner top-left" />
          <span className="tape-corner top-right" />
          <span className="tape-corner bottom-left" />
          <span className="tape-corner bottom-right" />
          
          <div className="memory-photo-wrapper">
            <img src={photo} alt="Memory" className="memory-photo" loading="lazy" />
          </div>
          <p className="memory-lyric">{lyric}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
