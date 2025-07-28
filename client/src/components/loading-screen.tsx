import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing Reality Capture...');

  const phases = [
    'Initializing Reality Capture...',
    'Loading 3D Engine...',
    'Preparing Drone Systems...',
    'Calibrating Sensors...',
    'Ready for Capture'
  ];

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update phase based on progress
        if (newProgress < 20) setCurrentPhase(phases[0]);
        else if (newProgress < 40) setCurrentPhase(phases[1]);
        else if (newProgress < 60) setCurrentPhase(phases[2]);
        else if (newProgress < 80) setCurrentPhase(phases[3]);
        else setCurrentPhase(phases[4]);

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-[hsl(218,11%,15%)] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-animation" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* 3D Drone Animation */}
          <div className="relative mb-8">
            <motion.div
              className="drone-container"
              animate={{ 
                rotateY: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 120 120" 
                className="drone-svg"
              >
                {/* Drone Body */}
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                >
                  {/* Main Body */}
                  <rect x="45" y="50" width="30" height="20" rx="4" fill="url(#droneGradient)" />
                  
                  {/* Arms */}
                  <rect x="20" y="57" width="25" height="3" rx="1.5" fill="#4a5568" />
                  <rect x="75" y="57" width="25" height="3" rx="1.5" fill="#4a5568" />
                  <rect x="57" y="25" width="3" height="25" rx="1.5" fill="#4a5568" />
                  <rect x="57" y="70" width="3" height="25" rx="1.5" fill="#4a5568" />
                  
                  {/* Propellers */}
                  <motion.circle 
                    cx="25" cy="59" r="8" 
                    fill="none" 
                    stroke="url(#propGradient)" 
                    strokeWidth="2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle 
                    cx="95" cy="59" r="8" 
                    fill="none" 
                    stroke="url(#propGradient)" 
                    strokeWidth="2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle 
                    cx="59" cy="30" r="8" 
                    fill="none" 
                    stroke="url(#propGradient)" 
                    strokeWidth="2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle 
                    cx="59" cy="90" r="8" 
                    fill="none" 
                    stroke="url(#propGradient)" 
                    strokeWidth="2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Camera Gimbal */}
                  <motion.circle 
                    cx="60" cy="70" r="6" 
                    fill="url(#cameraGradient)"
                    animate={{ 
                      rotateX: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  <circle cx="60" cy="70" r="3" fill="#1a202c" />
                </motion.g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="droneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(24,95%,53%)" />
                    <stop offset="100%" stopColor="hsl(199,89%,48%)" />
                  </linearGradient>
                  <linearGradient id="propGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(199,89%,48%)" />
                    <stop offset="100%" stopColor="hsl(158,64%,52%)" />
                  </linearGradient>
                  <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(158,64%,52%)" />
                    <stop offset="100%" stopColor="hsl(24,95%,53%)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Scanning Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-[hsl(199,89%,48%)] rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>

          {/* Brand Logo */}
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold font-mono text-lg">615</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Six1Five Studio</h1>
              <p className="text-[hsl(199,89%,48%)] text-sm font-medium">Reality Capture Technology</p>
            </div>
          </motion.div>

          {/* Loading Phase */}
          <motion.p 
            className="text-white text-lg mb-6 font-medium"
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentPhase}
          </motion.p>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Progress Percentage */}
          <motion.p 
            className="text-[hsl(199,89%,48%)] text-sm font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.p>

          {/* Technical Details */}
          <div className="mt-8 text-xs text-gray-400 space-y-1">
            <p>• Initializing photogrammetry engine</p>
            <p>• Loading 3D reconstruction algorithms</p>
            <p>• Preparing reality capture workspace</p>
          </div>
        </div>

        {/* Ambient particles */}
        <div className="particles-container absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[hsl(199,89%,48%)] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}