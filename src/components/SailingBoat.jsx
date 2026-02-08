import { motion, useAnimate } from 'framer-motion';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

export default function SailingBoat({ scrollProgress, cardRefs = [] }) {
  const [isUnderCard, setIsUnderCard] = useState(false);
  const [popEffect, setPopEffect] = useState(null); // 'splash' | 'popup' | null
  const boatRef = useRef(null);
  const [boatScope, animate] = useAnimate();
  const prevIsUnderCard = useRef(false);

  // Calculate boat position ON the curved path
  const pathPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = Math.sin(t * Math.PI * 3) * 80;
      const y = t * 90;
      points.push({ x, y });
    }
    return points;
  }, []);

  const progressIndex = Math.floor(scrollProgress * 100);
  const clampedIndex = Math.min(Math.max(progressIndex, 0), 100);
  const boatPos = pathPoints[clampedIndex] || { x: 0, y: 5 };

  // Collision detection - check if boat overlaps any card
  const checkCollision = useCallback(() => {
    if (!boatRef.current || cardRefs.length === 0) return false;

    const boatRect = boatRef.current.getBoundingClientRect();
    const boatCenterY = boatRect.top + boatRect.height / 2;

    for (const cardRef of cardRefs) {
      if (!cardRef?.current) continue;
      const cardRect = cardRef.current.getBoundingClientRect();
      
      // Check if boat center Y is within card bounds
      if (boatCenterY >= cardRect.top && boatCenterY <= cardRect.bottom) {
        return true;
      }
    }
    return false;
  }, [cardRefs]);

  // Check collision on every scroll change using requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    
    const checkAndAnimate = () => {
      const overlapping = checkCollision();
      
      if (overlapping !== prevIsUnderCard.current) {
        prevIsUnderCard.current = overlapping;
        setIsUnderCard(overlapping);
        
        if (overlapping) {
          // Pop Out - boat is entering under a card
          setPopEffect('splash');
          animate(boatScope.current, { scale: 0, opacity: 0 }, { duration: 0.2 });
          setTimeout(() => setPopEffect(null), 300);
        } else {
          // Pop In - boat is exiting from under a card
          setPopEffect('popup');
          animate(boatScope.current, { scale: 1, opacity: 1 }, { type: "spring", bounce: 0.5 });
          setTimeout(() => setPopEffect(null), 300);
        }
      }
    };

    // Run collision check
    animationFrameId = requestAnimationFrame(checkAndAnimate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scrollProgress, checkCollision, animate, boatScope]);

  return (
    <>
      <motion.div
        ref={(el) => {
          boatRef.current = el;
          if (boatScope.current !== el) {
            boatScope.current = el;
          }
        }}
        className="path-boat"
        style={{
          top: `${5 + boatPos.y}%`,
          left: `calc(50% + ${boatPos.x}px)`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 1, opacity: 1 }}
      >
        {/* Splash effect when entering tunnel */}
        {popEffect === 'splash' && (
          <>
            <motion.div
              className="tunnel-splash-ring"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="tunnel-splash-ring ring-2"
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            />
          </>
        )}

        {/* Pop-up effect when exiting tunnel */}
        {popEffect === 'popup' && (
          <motion.div
            className="tunnel-popup-burst"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Cute Paper Boat with bobbing animation */}
        <motion.svg 
          width="70" 
          height="50" 
          viewBox="0 0 60 45" 
          className="boat-icon"
          animate={{
            y: [0, -4, 0, -2, 0],
            rotate: [-2, 2, -1, 1, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Water ripples */}
          <ellipse cx="30" cy="38" rx="25" ry="3" fill="rgba(126, 200, 227, 0.3)" />
          <ellipse cx="30" cy="40" rx="20" ry="2" fill="rgba(126, 200, 227, 0.2)" />
          
          {/* Boat hull - bigger and cuter */}
          <path
            d="M5 28 L30 40 L55 28 L50 32 L30 38 L10 32 Z"
            fill="#f5e6d3"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hull highlight */}
          <path
            d="M12 30 L30 36 L48 30"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            opacity="0.5"
          />
          
          {/* Main sail */}
          <path
            d="M30 35 L30 8 L48 28 Z"
            fill="#fff"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sail stripes */}
          <path d="M30 12 L42 24" stroke="#ffd1dc" strokeWidth="2" opacity="0.6" />
          <path d="M30 18 L38 26" stroke="#ffd1dc" strokeWidth="2" opacity="0.6" />
          
          {/* Little flag */}
          <motion.path
            d="M30 8 L30 3 L38 5.5 L30 8"
            fill="#e8a0a0"
            stroke="#1a1a1a"
            strokeWidth="1"
            animate={{ 
              d: [
                "M30 8 L30 3 L38 5.5 L30 8",
                "M30 8 L30 3 L37 6 L30 8",
                "M30 8 L30 3 L38 5.5 L30 8"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Heart on the sail */}
          <text x="36" y="22" fontSize="6" fill="#e8a0a0">♥</text>
        </motion.svg>

        {/* Trailing hearts - only show when visible */}
        {!isUnderCard && (
          <>
            <motion.span
              className="trail-heart"
              style={{ fontSize: '0.9rem' }}
              animate={{ 
                opacity: [0, 0.9, 0], 
                y: [0, -20],
                x: [-8, -25],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              💕
            </motion.span>
            <motion.span
              className="trail-heart trail-heart-2"
              style={{ fontSize: '0.7rem' }}
              animate={{ 
                opacity: [0, 0.7, 0], 
                y: [0, -15],
                x: [8, 22],
                scale: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              ♥
            </motion.span>
            <motion.span
              className="trail-heart"
              style={{ fontSize: '0.5rem', left: '-10px' }}
              animate={{ 
                opacity: [0, 0.5, 0], 
                y: [5, -10],
                x: [-3, -15],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              ✨
            </motion.span>
          </>
        )}
      </motion.div>
    </>
  );
}

// Separate component for the path - to be rendered in background
export function JourneyPath() {
  return (
    <svg className="journey-path" viewBox="0 0 200 1000" preserveAspectRatio="none">
      <path
        d="M100 0 
           C 30 150, 30 150, 100 250
           C 170 350, 170 350, 100 500
           C 30 650, 30 650, 100 750
           C 170 850, 170 850, 100 1000"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeDasharray="8 12"
        opacity="0.3"
      />
    </svg>
  );
}
