import { useEffect, useState } from 'react';

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
    <div className="fixed inset-0 z-50 bg-[hsl(218,11%,15%)] flex items-center justify-center overflow-hidden">
      {/* Simple Content */}
      <div className="text-center max-w-md mx-auto px-6">
        {/* Simple Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold font-mono text-lg">615</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Six1Five Studio</h1>
            <p className="text-[hsl(199,89%,48%)] text-sm font-medium">Reality Capture Technology</p>
          </div>
        </div>

        {/* Simple Loading Phase */}
        <p className="text-white text-lg mb-6 font-medium">
          {currentPhase}
        </p>

        {/* Simple Progress Bar */}
        <div className="relative w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-[hsl(199,89%,48%)] text-sm font-mono">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}