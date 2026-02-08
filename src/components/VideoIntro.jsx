import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function VideoIntro({ isActive, videoSrc }) {
  const videoRef = useRef(null);

  // Auto-play video when active
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  if (!isActive) return null;

  // Floating elements data
  const floatingHearts = [
    { x: '10%', y: '15%', delay: 0, size: 24 },
    { x: '85%', y: '20%', delay: 0.5, size: 20 },
    { x: '5%', y: '70%', delay: 1, size: 18 },
    { x: '90%', y: '75%', delay: 1.5, size: 22 },
    { x: '15%', y: '45%', delay: 2, size: 16 },
    { x: '88%', y: '50%', delay: 0.8, size: 20 },
  ];

  const floatingStars = [
    { x: '8%', y: '30%', delay: 0.3 },
    { x: '92%', y: '35%', delay: 0.7 },
    { x: '12%', y: '85%', delay: 1.2 },
    { x: '87%', y: '88%', delay: 0.4 },
  ];

  const doodles = [
    { x: '3%', y: '25%', type: 'swirl', delay: 0.2 },
    { x: '93%', y: '40%', type: 'swirl', delay: 0.6 },
    { x: '7%', y: '60%', type: 'arrow', delay: 1 },
    { x: '91%', y: '65%', type: 'arrow', delay: 1.4 },
  ];

  return (
    <motion.div
      className="video-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Floating hearts */}
      {floatingHearts.map((heart, i) => (
        <motion.div
          key={`heart-${i}`}
          className="floating-decoration heart-deco"
          style={{ left: heart.x, top: heart.y, fontSize: heart.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -15, 0, 15, 0],
          }}
          transition={{
            duration: 4,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ♥
        </motion.div>
      ))}

      {/* Floating stars */}
      {floatingStars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          className="floating-decoration star-deco"
          style={{ left: star.x, top: star.y }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0.8, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 5,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Hand-drawn doodles */}
      {doodles.map((doodle, i) => (
        <motion.div
          key={`doodle-${i}`}
          className={`floating-decoration doodle-${doodle.type}`}
          style={{ left: doodle.x, top: doodle.y }}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: 6,
            delay: doodle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {doodle.type === 'swirl' ? '〰' : '➳'}
        </motion.div>
      ))}

      {/* Musical notes */}
      <motion.div
        className="floating-decoration music-note"
        style={{ left: '6%', top: '50%' }}
        animate={{ 
          y: [-10, 10, -10],
          opacity: [0.3, 0.7, 0.3],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ♪
      </motion.div>
      <motion.div
        className="floating-decoration music-note"
        style={{ left: '92%', top: '55%' }}
        animate={{ 
          y: [10, -10, 10],
          opacity: [0.3, 0.7, 0.3],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        ♫
      </motion.div>

      {/* Video container */}
      <motion.div
        className="video-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>
    </motion.div>
  );
}
