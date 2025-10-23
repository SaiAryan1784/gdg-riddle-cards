import { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Show text after a short delay
    setTimeout(() => setShowText(true), 500);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        {/* GDG Logo/Text */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-2">
            GDG
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
            Noida
          </h2>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-gdg-blue border-t-transparent rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
          
          {showText && (
            <p className="text-gray-600 text-lg animate-pulse-slow">
              Riddle Cards
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gdg-blue h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {Math.round(Math.min(progress, 100))}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
