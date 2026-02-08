import { motion, useAnimate, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

export default function SailingBoat({ scrollProgress, cardRefs = [] }) {
  const [isUnderCard, setIsUnderCard] = useState(false);
  const [popEffect, setPopEffect] = useState(null); // 'splash' | 'popup' | null
  const boatRef = useRef(null);
  const [boatScope, animate] = useAnimate();
  const prevIsUnderCard = useRef(false);
  const [progress, setProgress] = useState(typeof scrollProgress === 'number' ? scrollProgress : 0);
  const lastCollisionCheckAt = useRef(0);

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

  const progressIndex = Math.floor(progress * 100);
  const clampedIndex = Math.min(Math.max(progressIndex, 0), 100);
  const boatPos = pathPoints[clampedIndex] || { x: 0, y: 5 };

  // If a motion value is passed, subscribe without forcing parent rerenders
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (typeof latest === 'number') setProgress(latest);
  });

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
      const now = performance.now();
      if (now - lastCollisionCheckAt.current < 80) return; // throttle rect reads on mobile
      lastCollisionCheckAt.current = now;

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
  }, [progress, checkCollision, animate, boatScope]);

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

        {/* Cute Paper Boat (kawaii) with bobbing animation */}
        <motion.svg 
          width="70" 
          height="50" 
          viewBox="0 0 60 45" 
          className="boat-icon"
          style={{
            width: 'clamp(46px, 10vw, 70px)',
            height: 'auto',
          }}
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
          <defs>
            <linearGradient id="boatHullGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff4e8" />
              <stop offset="100%" stopColor="#f2ddc8" />
            </linearGradient>
            <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fff7fb" />
            </linearGradient>
          </defs>

          {/* Water ripples */}
          <ellipse cx="30" cy="39" rx="24" ry="3.2" fill="rgba(126, 200, 227, 0.26)" />
          <ellipse cx="30" cy="41" rx="18" ry="2.2" fill="rgba(126, 200, 227, 0.18)" />

          {/* Tiny sparkle */}
          <motion.circle
            cx="12"
            cy="16"
            r="1.2"
            fill="rgba(255, 243, 176, 0.9)"
            animate={{ opacity: [0.2, 0.9, 0.2], r: [1, 1.7, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Mast */}
          <path
            d="M30 35 L30 7"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Sail + flag group (gentle flutter) */}
          <motion.g
            style={{ transformOrigin: '30px 22px', transformBox: 'fill-box' }}
            animate={{ rotate: [0, 1.2, 0, -1, 0], skewX: [0, -2, 0, 2, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Main sail */}
            <path
              d="M30 33 L30 9 L49 28 Q41 31 30 33 Z"
              fill="url(#sailGrad)"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Sail stripes */}
            <path d="M31 13 L44 24" stroke="#ffd1dc" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
            <path d="M31 19 L40 26" stroke="#ffd1dc" strokeWidth="2" opacity="0.55" strokeLinecap="round" />

            {/* Heart patch on sail */}
            <path
              d="M38.8 19.5
                 C 37.7 18.3, 35.7 18.7, 35.7 20.3
                 C 35.7 22.0, 38.8 23.5, 38.8 23.5
                 C 38.8 23.5, 41.9 22.0, 41.9 20.3
                 C 41.9 18.7, 39.9 18.3, 38.8 19.5 Z"
              fill="#e8a0a0"
              opacity="0.9"
            />

            {/* Little flag (wavy) */}
            <motion.path
              d="M30 7 L30 3 L39 5.2 L30 7"
              fill="#e8a0a0"
              stroke="#1a1a1a"
              strokeWidth="1"
              style={{ transformOrigin: '30px 3px', transformBox: 'fill-box' }}
              animate={{ rotate: [0, 10, -8, 0], scaleX: [1, 1.06, 0.98, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Boat hull (rounded + cute) */}
          <path
            d="M7 28
               L30 40
               L53 28
               Q51 34 44 35
               L30 38
               L16 35
               Q9 34 7 28 Z"
            fill="url(#boatHullGrad)"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Hull highlight */}
          <path
            d="M14 31 Q30 38 46 31"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.45"
            strokeLinecap="round"
          />

          {/* Kawaii face */}
          <circle cx="24" cy="33.5" r="1.2" fill="#1a1a1a" />
          <circle cx="36" cy="33.5" r="1.2" fill="#1a1a1a" />
          <path
            d="M28 35.5 Q30 37 32 35.5"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Blush */}
          <circle cx="20.5" cy="35.5" r="1.5" fill="rgba(232, 160, 160, 0.55)" />
          <circle cx="39.5" cy="35.5" r="1.5" fill="rgba(232, 160, 160, 0.55)" />
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
