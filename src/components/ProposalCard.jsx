import { motion, useAnimation } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function ProposalCard({ isVisible, onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const containerRef = useRef(null);
  const noButtonRef = useRef(null);
  
  // Make the No button run away
  const runAway = () => {
    if (!containerRef.current || !noButtonRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();
    
    // Calculate available space
    const maxX = container.width - button.width - 40;
    const maxY = container.height - button.height - 40;
    
    // Random new position (away from current)
    let newX = Math.random() * maxX - maxX / 2;
    let newY = Math.random() * maxY - maxY / 2;
    
    // Ensure it actually moves significantly
    const minDistance = 100;
    if (Math.abs(newX - noPosition.x) < minDistance) {
      newX = noPosition.x > 0 ? -maxX / 2 : maxX / 2;
    }
    if (Math.abs(newY - noPosition.y) < minDistance) {
      newY = noPosition.y > 0 ? -maxY / 2 : maxY / 2;
    }
    
    setNoPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="proposal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Blurred background */}
      <div className="proposal-backdrop" />
      
      <motion.div
        ref={containerRef}
        className="proposal-card"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.5,
          type: "spring",
          stiffness: 100 
        }}
      >
        <motion.div
          className="proposal-emoji"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ❤️
        </motion.div>
        
        <h2 className="proposal-title">
          Will you be my forever?
        </h2>
        
        <p className="proposal-subtitle">
          Through every moment, every memory, every dream... btw try to press no button 😉
        </p>
        
        <div className="proposal-buttons">
          <motion.button
            className="btn-yes"
            onClick={onYes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes 💕
          </motion.button>
          
          <motion.button
            ref={noButtonRef}
            className="btn-no"
            animate={{ 
              x: noPosition.x, 
              y: noPosition.y,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            onHoverStart={runAway}
            onTapStart={runAway}
            onMouseEnter={runAway}
          >
            No
          </motion.button>
        </div>
        
        {escapeCount > 2 && (
          <motion.p
            className="proposal-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            {escapeCount > 5 
              ? "Nice try! 😏" 
              : "The 'No' button seems shy..."}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
