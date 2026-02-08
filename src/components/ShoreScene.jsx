import { motion, AnimatePresence } from 'framer-motion';

export default function ShoreScene({ isActive, onComplete }) {
  if (!isActive) return null;

  // Generate random seagulls
  const seagulls = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    top: 5 + Math.random() * 20,
    delay: i * 0.8,
    duration: 3 + Math.random() * 2,
  }));

  // Generate stars/sparkles
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 40,
    delay: i * 0.3,
  }));

  // Generate floating hearts
  const floatingHearts = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    delay: 3.5 + i * 0.4,
    size: 1 + Math.random() * 1.5,
  }));

  return (
    <AnimatePresence>
      <motion.div
        className="shore-scene"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Beautiful sunset sky gradient */}
        <div className="shore-bg">
          {/* Sun */}
          <motion.div 
            className="shore-sun"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Sun reflection on water */}
          <motion.div 
            className="sun-reflection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Clouds */}
          <motion.div 
            className="cloud cloud-1"
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="cloud cloud-2"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="cloud cloud-3"
            animate={{ x: [0, 25, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Seagulls flying */}
        {seagulls.map((bird) => (
          <motion.div
            key={bird.id}
            className="seagull"
            style={{ left: `${bird.left}%`, top: `${bird.top}%` }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: [0, 50, 100],
              y: [0, -10, 5, -5, 0],
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{ 
              duration: bird.duration,
              delay: bird.delay,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            🕊️
          </motion.div>
        ))}

        {/* Ocean with multiple wave layers */}
        <div className="shore-ocean">
          <div className="ocean-gradient" />
          <div className="shore-waves">
            <div className="wave wave-1" />
            <div className="wave wave-2" />
            <div className="wave wave-3" />
            <div className="wave wave-4" />
          </div>
          {/* Foam on shore */}
          <motion.div 
            className="wave-foam"
            animate={{ 
              x: [0, 10, 0],
              scaleX: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Shore/Beach with texture */}
        <div className="shore-beach">
          {/* Footprints animation */}
          <motion.div 
            className="footprints left-prints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 2 }}
          >
            👣
          </motion.div>
          <motion.div 
            className="footprints right-prints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            👣
          </motion.div>
        </div>
        
        {/* Boy figure - coming from left with walking animation */}
        <motion.div
          className="figure boy-figure"
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: 'calc(50vw - 70px)', opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeOut", delay: 0.5 }}
        >
          <motion.div 
            className="figure-body"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div className="figure-head">
              <div className="figure-hair boy-hair" />
              <div className="figure-face" />
            </div>
            <div className="figure-torso boy-shirt">
              <div className="figure-arm left-arm" />
              <div className="figure-arm right-arm" />
            </div>
            <div className="figure-legs">
              <motion.div 
                className="leg"
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div 
                className="leg"
                animate={{ rotate: [10, -10, 10] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Girl figure - coming from right with walking animation */}
        <motion.div
          className="figure girl-figure"
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: 'calc(50vw + 20px)', opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeOut", delay: 0.5 }}
        >
          <motion.div 
            className="figure-body"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
          >
            {/* Long hair back - positioned BEHIND everything at body level */}
            <motion.div 
              className="girl-hair-back-positioner"
            >
              <motion.div
                className="girl-hair-back-wrapper"
                animate={{ skewX: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            {/* Head with face and hair top */}
            <div className="figure-head">
              <div className="figure-hair girl-hair">
                <motion.div 
                  className="long-hair-strand left-strand"
                  animate={{ rotate: [-5, 5, -5], x: [-1, 1, -1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="long-hair-strand right-strand"
                  animate={{ rotate: [5, -5, 5], x: [1, -1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
              </div>
              <div className="figure-face" />
            </div>
            
            {/* Dress bodice */}
            <div className="figure-torso girl-dress">
              <div className="figure-arm left-arm" />
              <div className="figure-arm right-arm" />
            </div>
            
            {/* Flared skirt */}
            <motion.div 
              className="girl-skirt"
              animate={{ 
                scaleX: [1, 1.02, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Legs */}
            <div className="figure-legs">
              <motion.div 
                className="leg"
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div 
                className="leg"
                animate={{ rotate: [8, -8, 8] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Sparkles in the sky */}
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="sky-sparkle"
            style={{ left: `${sparkle.left}%`, top: `${sparkle.top}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              delay: sparkle.delay,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            ✨
          </motion.div>
        ))}
        
        {/* Heart appears when they meet - with burst effect */}
        <motion.div
          className="meeting-heart-container"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 4 
          }}
        >
          <motion.div
            className="meeting-heart"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💕
          </motion.div>
          
          {/* Heart burst particles */}
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="burst-heart"
              style={{ fontSize: `${heart.size}rem` }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 200,
                y: -100 - Math.random() * 100,
                scale: [0, 1, 0.5],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: heart.delay,
                ease: "easeOut"
              }}
            >
              💗
            </motion.div>
          ))}
        </motion.div>

        {/* Romantic text */}
        <motion.div
          className="shore-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.5 }}
        >
          Together Forever 💕
        </motion.div>
        
        {/* Blur overlay before proposal */}
        <motion.div
          className="blur-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 6 }}
          onAnimationComplete={onComplete}
        />
      </motion.div>
    </AnimatePresence>
  );
}
