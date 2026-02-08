import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ProposalOverlay = ({ isOpen, onYes }) => {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);

  const handleYes = () => {
    // Massive confetti explosion
    const duration = 6000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff1744', '#ec4899', '#f472b6', '#22d3ee', '#fbbf24', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });

    setShowSuccess(true);
    onYes();
  };

  const handleNoInteraction = () => {
    const padding = 100;
    const maxX = window.innerWidth - padding * 2;
    const maxY = window.innerHeight - padding * 2;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    setNoButtonPos({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
  };

  const floatingHearts = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    size: 0.8 + Math.random() * 1.2,
  }));

  if (showSuccess) {
    return (
      <motion.div
        className="success-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="floating-hearts">
          {floatingHearts.map((heart) => (
            <span
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                fontSize: `${heart.size}rem`,
              }}
            >
              💕
            </span>
          ))}
        </div>
        <motion.div
          className="success-emoji"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          💍
        </motion.div>
        <motion.h1
          className="success-text"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          She said YES!
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="success-subtext"
        >
          Forever Written in the Stars ✨
        </motion.p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="glass-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="glass-card"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          >
            <motion.div
              className="card-emoji"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              💫
            </motion.div>
            
            <motion.h1
              className="proposal-headline"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Happy Propose Day!
            </motion.h1>

            <motion.p
              className="proposal-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Our souls finally found each other in this universe...
              <br /><br />
              <strong>Do you want to continue with me like that?</strong>
            </motion.p>

            <div className="button-container">
              <motion.button
                className="yes-btn"
                onClick={handleYes}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Yes! 💍
              </motion.button>

              <motion.button
                className="no-btn"
                onMouseEnter={handleNoInteraction}
                onTouchStart={handleNoInteraction}
                initial={{ x: 50, opacity: 0 }}
                animate={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                  opacity: 1,
                }}
                transition={{
                  x: { type: 'spring', stiffness: 400, damping: 25 },
                  y: { type: 'spring', stiffness: 400, damping: 25 },
                  opacity: { delay: 0.5 },
                }}
              >
                {escapeCount > 6 ? "🏃💨" : escapeCount > 3 ? "Nope!" : "No"}
              </motion.button>
            </div>

            {escapeCount > 2 && (
              <motion.p
                className="hint-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              >
                {escapeCount > 5
                  ? "The 'No' is written in the stars... just not for you! 😉"
                  : "That button seems to have a mind of its own..."}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposalOverlay;
