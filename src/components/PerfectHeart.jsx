import { motion } from 'framer-motion';

/**
 * PerfectHeart - Floating decorative badge with handwritten "Perfect" text
 * inside a hand-drawn style heart SVG with gentle heartbeat animation.
 */
function PerfectHeart() {
  return (
    <motion.div
      className="perfect-heart-badge"
      animate={{ 
        scale: [1, 1.05, 1], 
        rotate: [0, 5, -5, 0] 
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Hand-drawn style heart SVG */}
      <svg
        viewBox="0 0 100 100"
        className="perfect-heart-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Heart path with slightly imperfect stroke */}
        <path
          d="M50 88 
             C20 65, 5 45, 12 28 
             C18 12, 35 10, 50 25 
             C65 10, 82 12, 88 28 
             C95 45, 80 65, 50 88Z"
          fill="rgba(232, 160, 160, 0.3)"
          stroke="rgba(232, 160, 160, 0.8)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(232, 160, 160, 0.5))'
          }}
        />
        
        {/* "Perfect" text inside the heart */}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          className="perfect-heart-text"
          style={{
            fontFamily: "'Permanent Marker', cursive",
            fontSize: '16px',
            fill: 'white',
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
          }}
        >
          Perfect
        </text>
      </svg>
    </motion.div>
  );
}

export default PerfectHeart;
