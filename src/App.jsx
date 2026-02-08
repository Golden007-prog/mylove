import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import VideoIntro from './components/VideoIntro';
import TimelineJourney from './components/TimelineJourney';
import ShoreScene from './components/ShoreScene';
import ProposalCard from './components/ProposalCard';
import FinalScreen from './components/FinalScreen';
import VolumeControl from './components/VolumeControl';
import LyricsOverlay from './components/LyricsOverlay';
import PerfectHeart from './components/PerfectHeart';
import { 
  LOADING_END_TIME, 
  VIDEO_END_TIME, 
  SHORE_TIME, 
  PROPOSAL_TIME 
} from './data/timeline';
import './index.css';

function App() {
  // Phases: 'landing' | 'waiting' | 'video' | 'journey' | 'shore' | 'proposal' | 'finale'
  const [phase, setPhase] = useState('landing');
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Handle play button click
  const handlePlay = async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        setPhase('waiting');
      } catch (error) {
        console.error('Audio play failed:', error);
      }
    }
  };

  // Audio time tracking and phase transitions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      // Phase transitions based on audio time
      if (time >= PROPOSAL_TIME && phase !== 'proposal' && phase !== 'finale') {
        setPhase('proposal');
      } else if (time >= SHORE_TIME && phase === 'journey') {
        setPhase('shore');
      } else if (time >= VIDEO_END_TIME && phase === 'video') {
        setPhase('journey');
      } else if (time >= LOADING_END_TIME && phase === 'waiting') {
        setPhase('video');
      }
    };

    const handleEnded = () => {
      if (phase !== 'finale') {
        setPhase('proposal');
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [phase]);

  // Handle shore scene complete - show proposal
  const handleShoreComplete = () => {
    setPhase('proposal');
  };

  // Handle Yes click from proposal
  const handleYes = () => {
    setPhase('finale');
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="app">
      {/* Background */}
      <div className="app-background" />
      
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        src={`${import.meta.env.BASE_URL}music/background.m4a`}
        preload="auto"
      />
      
      <AnimatePresence mode="wait">
        {/* Phase 1: Landing Screen */}
        {phase === 'landing' && (
          <LandingScreen key="landing" onPlay={handlePlay} />
        )}
        
        {/* Phase 1.5: Waiting (brief transition) */}
        {phase === 'waiting' && (
          <div key="waiting" className="waiting-screen">
            <div className="waiting-content">
              <div className="pulse-circle" />
              <p className="waiting-text">Close your eyes...</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Phase 2a: Video Intro (20s - 57s) */}
      <VideoIntro 
        isActive={phase === 'video'}
        videoSrc={`${import.meta.env.BASE_URL}video/1.mp4`}
      />

      {/* Lyrics overlay during video */}
      <LyricsOverlay 
        currentTime={currentTime}
        isActive={phase === 'video'}
      />

      {/* Perfect Heart Badge - floating decoration during video */}
      {phase === 'video' && <PerfectHeart />}

      {/* Phase 2b: Timeline Journey (after video) */}
      <TimelineJourney 
        currentTime={currentTime}
        isActive={phase === 'journey'}
        audioRef={audioRef}
      />

      {/* Phase 2c: Shore Scene (boy meets girl) */}
      <ShoreScene 
        isActive={phase === 'shore'}
        onComplete={handleShoreComplete}
      />

      {/* Phase 3: Proposal Card */}
      <ProposalCard 
        isVisible={phase === 'proposal'}
        onYes={handleYes}
      />

      {/* Phase 4: Final Screen */}
      <FinalScreen isVisible={phase === 'finale'} />

      {/* Volume Control - visible during playback */}
      {phase !== 'landing' && phase !== 'finale' && phase !== 'shore' && (
        <VolumeControl audioRef={audioRef} />
      )}
    </div>
  );
}

export default App;
