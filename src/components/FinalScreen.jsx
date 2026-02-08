import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function FinalScreen({ isVisible }) {
  // Trigger confetti on mount
  useEffect(() => {
    if (!isVisible) return;
    
    // Initial burst
    const burst = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ff1493', '#ff6b6b', '#ffd700', '#fff'],
      });
    };
    
    // Multiple bursts
    burst();
    const timer1 = setTimeout(burst, 500);
    const timer2 = setTimeout(burst, 1000);
    
    // Continuous gentle confetti
    const interval = setInterval(() => {
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#ff69b4', '#ff1493', '#ffd700'],
      });
    }, 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="final-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Background hearts */}
      <div className="floating-hearts-final">
        {[...Array(15)].map((_, i) => (
          <motion.span
            key={i}
            className="floating-heart"
            initial={{ 
              x: Math.random() * 100 + 'vw',
              y: '110vh',
              opacity: 0,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.8, 0.8, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          >
            💕
          </motion.span>
        ))}
      </div>
      
      {/* Glowing Heart with Photo */}
      <motion.div
        className="heart-container"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 1,
          delay: 0.5,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="glowing-heart">
          <div className="heart-glow" />
          <div className="heart-shape">
            <video 
              src={`${import.meta.env.BASE_URL}video/forever.mp4`}
              autoPlay
              loop
              muted
              playsInline
              className="heart-photo"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </motion.div>
      
      {/* FOREVER Text */}
      <motion.h1
        className="forever-text"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        FOREVER
      </motion.h1>
      
      {/* Sparkles around text */}
      <div className="sparkles">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="sparkle"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>
      
      <motion.p
        className="final-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        Together, Always 💕
      </motion.p>
    </motion.div>
  );
}
