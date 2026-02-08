import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for "Turntable" scroll behavior
 * - Auto-scroll when not interacting
 * - Manual scroll pauses audio and scrubs through timeline
 * - Resumes after 2s of no interaction
 */
export function useScrollScrub(audioRef, songDuration, journeyStartTime) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const debounceTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate audio time from scroll position
  const getAudioTimeFromScroll = useCallback((scrollPercent) => {
    const journeyDuration = songDuration - journeyStartTime;
    return journeyStartTime + (scrollPercent * journeyDuration);
  }, [songDuration, journeyStartTime]);

  // Calculate scroll position from audio time
  const getScrollFromAudioTime = useCallback((audioTime) => {
    const journeyDuration = songDuration - journeyStartTime;
    const journeyTime = Math.max(0, audioTime - journeyStartTime);
    return Math.min(journeyTime / journeyDuration, 1);
  }, [songDuration, journeyStartTime]);

  // Handle user scroll interaction
  const handleScrollStart = useCallback(() => {
    setIsUserScrolling(true);
    
    // Pause audio when user starts scrolling
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, [audioRef]);

  // Handle scroll movement - update audio time
  const handleScroll = useCallback((deltaY, containerHeight, totalScrollHeight) => {
    if (!isUserScrolling) {
      handleScrollStart();
    }

    // Calculate new scroll progress
    const scrollDelta = deltaY / totalScrollHeight;
    const newProgress = Math.max(0, Math.min(1, scrollProgress + scrollDelta));
    setScrollProgress(newProgress);

    // Update audio currentTime to match scroll position
    if (audioRef.current) {
      const newAudioTime = getAudioTimeFromScroll(newProgress);
      audioRef.current.currentTime = newAudioTime;
    }

    // Reset debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer - resume after 2 seconds
    debounceTimerRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      // Resume audio playback
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log('Resume failed:', err));
      }
    }, 2000);
  }, [audioRef, isUserScrolling, scrollProgress, getAudioTimeFromScroll, handleScrollStart]);

  // Update scroll progress from audio time (auto-scroll mode)
  const syncScrollToAudio = useCallback((audioTime) => {
    if (!isUserScrolling) {
      const newProgress = getScrollFromAudioTime(audioTime);
      setScrollProgress(newProgress);
    }
  }, [isUserScrolling, getScrollFromAudioTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    isUserScrolling,
    scrollProgress,
    handleScroll,
    handleScrollStart,
    syncScrollToAudio,
    containerRef,
  };
}
