import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useCallback, createRef, useLayoutEffect, useMemo } from 'react';
import MemoryCard from './MemoryCard';
import SailingBoat, { JourneyPath } from './SailingBoat';
import LyricsBackground from './LyricsBackground';
import { timeline, SONG_DURATION, VIDEO_END_TIME } from '../data/timeline';

// Global time offset (0 = exact sync with CSV timestamps)
const TIME_OFFSET = 0;

export default function TimelineJourney({ currentTime, isActive, audioRef }) {
  const [visibleCards, setVisibleCards] = useState([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [keyframes, setKeyframes] = useState([]);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const lastTouchY = useRef(0);
  const scrollYRef = useRef(0);
  const desiredScrollYRef = useRef(0);
  const scrollRafRef = useRef(null);

  // Motion values (avoid rerendering whole timeline on every pixel)
  const scrollYMotion = useMotionValue(0);
  const scrollProgressMotion = useMotionValue(0);
  const containerY = useTransform(scrollYMotion, (v) => -v);

  // Create refs for all memory cards for collision detection and position measurement
  const cardRefs = useRef(timeline.map(() => createRef()));

  // Calculate keyframes (card positions mapped to timestamps) after mount
  useLayoutEffect(() => {
    if (!isActive || !scrollContainerRef.current) return;

    // Wait for cards to render and measure their positions
    const measurePositions = () => {
      const newKeyframes = [];
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      
      cardRefs.current.forEach((ref, index) => {
        if (ref.current) {
          const cardRect = ref.current.getBoundingClientRect();
          const relativeTop = ref.current.offsetTop;
          const cardHeight = cardRect.height;
          
          newKeyframes.push({
            index,
            time: timeline[index].timeStart,
            offsetY: relativeTop,
            cardHeight,
          });
        }
      });

      // Sort by time to ensure correct order
      newKeyframes.sort((a, b) => a.time - b.time);
      
      if (newKeyframes.length > 0) {
        setKeyframes(newKeyframes);
      }
    };

    // Delay measurement to ensure DOM is fully rendered
    const timer = setTimeout(measurePositions, 100);
    
    // Remeasure on window resize
    window.addEventListener('resize', measurePositions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measurePositions);
    };
  }, [isActive]);

  // Compute maximum scroll to clamp (prevents runaway scroll values)
  const maxScrollY = useMemo(() => {
    if (keyframes.length === 0) return 0;
    const viewportHeight = window.innerHeight || 0;
    const lastKeyframe = keyframes[keyframes.length - 1];
    const lastCentered =
      lastKeyframe.offsetY - (viewportHeight / 2) + (lastKeyframe.cardHeight / 2);
    return Math.max(0, lastCentered);
  }, [keyframes]);

  // LERP-based scroll calculation from audio time
  const getScrollFromAudioTime = useCallback((audioTime) => {
    if (keyframes.length === 0) return 0;

    // Find the bracket keyframes (prev and next)
    let prevKeyframe = keyframes[0];
    let nextKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length; i++) {
      if (keyframes[i].time <= audioTime) {
        prevKeyframe = keyframes[i];
      }
      if (keyframes[i].time > audioTime && (i === 0 || keyframes[i - 1].time <= audioTime)) {
        nextKeyframe = keyframes[i];
        break;
      }
    }

    // If audio time is before first keyframe, scroll to first
    if (audioTime <= keyframes[0].time) {
      return 0;
    }

    // If audio time is after last keyframe, scroll to last
    if (audioTime >= keyframes[keyframes.length - 1].time) {
      const viewportHeight = window.innerHeight;
      const lastKeyframe = keyframes[keyframes.length - 1];
      return lastKeyframe.offsetY - (viewportHeight / 2) + (lastKeyframe.cardHeight / 2);
    }

    // LERP between prev and next keyframes
    const timeDiff = nextKeyframe.time - prevKeyframe.time;
    const t = timeDiff > 0 ? (audioTime - prevKeyframe.time) / timeDiff : 0;
    const interpolatedY = prevKeyframe.offsetY + (nextKeyframe.offsetY - prevKeyframe.offsetY) * t;

    // Center the card in viewport
    const viewportHeight = window.innerHeight;
    const cardHeight = prevKeyframe.cardHeight || 300;
    const centeredScrollY = interpolatedY - (viewportHeight / 2) + (cardHeight / 2);

    return Math.max(0, centeredScrollY);
  }, [keyframes]);

  // Calculate audio time from scroll position (for manual scrolling)
  const getAudioTimeFromScroll = useCallback((scrollPosition) => {
    if (keyframes.length === 0) return VIDEO_END_TIME;

    const viewportHeight = window.innerHeight;
    
    // Find which keyframes bracket this scroll position
    let prevKeyframe = keyframes[0];
    let nextKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length; i++) {
      const centeredY = keyframes[i].offsetY - (viewportHeight / 2) + (keyframes[i].cardHeight / 2);
      if (centeredY <= scrollPosition) {
        prevKeyframe = keyframes[i];
      }
      if (centeredY > scrollPosition) {
        nextKeyframe = keyframes[i];
        break;
      }
    }

    // LERP to find audio time
    const prevCenteredY = prevKeyframe.offsetY - (viewportHeight / 2) + (prevKeyframe.cardHeight / 2);
    const nextCenteredY = nextKeyframe.offsetY - (viewportHeight / 2) + (nextKeyframe.cardHeight / 2);
    const scrollDiff = nextCenteredY - prevCenteredY;
    
    if (scrollDiff === 0) return prevKeyframe.time;
    
    const t = Math.max(0, Math.min(1, (scrollPosition - prevCenteredY) / scrollDiff));
    return prevKeyframe.time + (nextKeyframe.time - prevKeyframe.time) * t;
  }, [keyframes]);

  // Update scroll position from audio time when not user scrolling
  useEffect(() => {
    if (isActive && !isUserScrolling && keyframes.length > 0) {
      // Apply time offset so lyrics appear slightly before audio
      const adjustedTime = currentTime - TIME_OFFSET;
      const newScrollY = getScrollFromAudioTime(adjustedTime);
      const clamped = Math.min(Math.max(newScrollY, 0), maxScrollY || newScrollY);
      scrollYRef.current = clamped;
      desiredScrollYRef.current = clamped;
      scrollYMotion.set(clamped);

      const progress =
        keyframes.length > 0
          ? Math.min(1, Math.max(0, clamped / (keyframes[keyframes.length - 1]?.offsetY || 1)))
          : 0;
      scrollProgressMotion.set(progress);
    }
  }, [
    currentTime,
    isActive,
    isUserScrolling,
    getScrollFromAudioTime,
    keyframes,
    maxScrollY,
    scrollYMotion,
    scrollProgressMotion,
  ]);

  // Update visible cards based on current time
  // First card is always visible when timeline is active to avoid blank screen
  useEffect(() => {
    if (!isActive) return;
    // Apply time offset so cards appear slightly before audio
    const adjustedTime = currentTime - TIME_OFFSET;
    // Show first card immediately, then others based on their timestamp
    const visible = timeline.filter((card, index) => 
      index === 0 || adjustedTime >= card.timeStart
    );
    setVisibleCards(visible);
  }, [currentTime, isActive]);

  // Handle scroll start - pause audio
  const handleScrollStart = useCallback(() => {
    if (!isUserScrolling) {
      setIsUserScrolling(true);
      if (audioRef?.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [audioRef, isUserScrolling]);

  // Resume audio immediately
  const resumeAudio = useCallback(() => {
    setIsUserScrolling(false);
    if (audioRef?.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log('Resume failed:', err));
    }
  }, [audioRef]);

  // Update scroll and audio position (manual scroll)
  const updateScroll = useCallback((deltaY) => {
    handleScrollStart();
    
    // Accumulate desired scroll in a ref (no rerender)
    const nextDesired = desiredScrollYRef.current + deltaY;
    desiredScrollYRef.current = Math.min(Math.max(nextDesired, 0), maxScrollY || nextDesired);

    // Batch DOM/motion updates to once per animation frame
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;

      const newScrollY = desiredScrollYRef.current;
      scrollYRef.current = newScrollY;
      scrollYMotion.set(newScrollY);

      // Update progress for boat/progress bar without rerender
      const progress =
        keyframes.length > 0
          ? Math.min(1, Math.max(0, newScrollY / (keyframes[keyframes.length - 1]?.offsetY || 1)))
          : 0;
      scrollProgressMotion.set(progress);

      // Update audio time to match scroll position
      if (audioRef?.current && keyframes.length > 0) {
        const newAudioTime = getAudioTimeFromScroll(newScrollY);
        audioRef.current.currentTime = newAudioTime;
      }
    });
  }, [
    handleScrollStart,
    audioRef,
    getAudioTimeFromScroll,
    keyframes,
    maxScrollY,
    scrollYMotion,
    scrollProgressMotion,
  ]);

  // Mouse wheel handler
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    updateScroll(e.deltaY);
  }, [updateScroll]);

  // Mouse click handler - resume on click
  const handleClick = useCallback(() => {
    if (isUserScrolling) {
      resumeAudio();
    }
  }, [isUserScrolling, resumeAudio]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    lastTouchY.current = e.touches[0].clientY;
    handleScrollStart();
  }, [handleScrollStart]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const deltaY = lastTouchY.current - currentY;
    lastTouchY.current = currentY;
    updateScroll(deltaY);
  }, [updateScroll]);

  // IMPORTANT: don't auto-resume on touch end.
  // User can tap to resume (existing "Tap to play" indicator).
  const handleTouchEnd = useCallback(() => {}, []);

  // Attach event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, handleWheel, handleClick, handleTouchStart, handleTouchMove, handleTouchEnd]);

  if (!isActive) return null;

  return (
    <motion.div
      ref={containerRef}
      className="timeline-journey"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background elements - lowest layer */}
      <LyricsBackground />
      
      {/* Journey path - behind cards */}
      <JourneyPath />
      
      {/* Cute decorations to fill empty space */}
      <div className="timeline-cute-decor" aria-hidden="true">
        <motion.span
          className="cute-sticker sticker-cloud"
          animate={{ y: [0, -6, 0], x: [0, 4, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.span>

        <motion.span
          className="cute-sticker sticker-bow"
          animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          🎀
        </motion.span>

        <motion.span
          className="cute-sticker sticker-bear"
          animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          🧸
        </motion.span>

        <motion.div
          className="cute-arrow"
          animate={{ y: [0, 6, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓ ↓ ↓
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {isUserScrolling && (
        <div className="scroll-indicator">
          <span>Tap to play ▶</span>
        </div>
      )}
      
      {/* Auto-scrolling container - using pixel-based transform */}
      <motion.div
        ref={scrollContainerRef}
        className="timeline-scroll-container"
        style={{
          y: containerY,
        }}
      >
        {timeline.map((card, index) => (
          <div 
            key={index} 
            className="timeline-card-wrapper"
            ref={cardRefs.current[index]}
            data-card-index={index}
            data-time-start={card.timeStart}
          >
            <MemoryCard
              lyric={card.lyric}
              photo={card.photo}
              index={index}
              type={card.type || 'photo'}
              isVisible={visibleCards.some(v => v.timeStart === card.timeStart)}
            />
          </div>
        ))}
      </motion.div>
      
      {/* Progress bar */}
      <div className="timeline-progress">
        <motion.div
          className="timeline-progress-fill"
          style={{
            height: '100%',
            scaleY: scrollProgressMotion,
            transformOrigin: 'top',
          }}
        />
      </div>
      
      {/* Subtle floating particles + cute hearts */}
      <div className="ambient-particles">
        {/* Ambient floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={`heart-${i}`}
            className="ambient-heart"
            style={{ left: `${10 + i * 15}%` }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.5, 0.5, 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 14 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 2.5,
              ease: "linear",
            }}
          >
            {i % 2 === 0 ? '💕' : '♥'}
          </motion.span>
        ))}
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * 100 + 'vw',
              y: '110vh',
              opacity: 0 
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
            style={{
              width: 6 + Math.random() * 4,
              height: 6 + Math.random() * 4,
            }}
          />
        ))}
        
        {/* Sparkle effects */}
        {[...Array(4)].map((_, i) => (
          <motion.span
            key={`sparkle-${i}`}
            style={{
              position: 'fixed',
              left: `${20 + i * 20}%`,
              top: `${15 + i * 18}%`,
              fontSize: '1rem',
              pointerEvents: 'none',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 1.2,
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>
      
      {/* Sailing boat - with card refs for collision detection */}
      <SailingBoat scrollProgress={scrollProgressMotion} cardRefs={cardRefs.current} />
    </motion.div>
  );
}
