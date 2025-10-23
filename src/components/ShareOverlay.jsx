import { useState, useRef, useEffect } from 'react';
import { captureShareImage, shareImage } from '../lib/capture';

const ShareOverlay = ({ color, suit, question, answer, onClose }) => {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef(null);

  const colorClasses = {
    blue: 'border-gdg-blue bg-gdg-blue/10',
    green: 'border-gdg-green bg-gdg-green/10',
    yellow: 'border-gdg-yellow bg-gdg-yellow/10',
    red: 'border-gdg-red bg-gdg-red/10'
  };

  const colorBgs = {
    blue: 'bg-gdg-blue',
    green: 'bg-gdg-green',
    yellow: 'bg-gdg-yellow',
    red: 'bg-gdg-red'
  };

  // Hex color mappings for image capture (matching Tailwind config)
  const colorHex = {
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#F9AB00',
    red: '#EA4335'
  };

  const suitSymbols = {
    spade: '♠',
    club: '♣',
    heart: '♥',
    diamond: '♦'
  };

  const suitColors = {
    spade: 'text-black',
    club: 'text-black',
    heart: 'text-red-500',
    diamond: 'text-red-500'
  };

  const suitColorsHex = {
    spade: '#000000',
    club: '#000000',
    heart: '#ef4444',
    diamond: '#ef4444'
  };

  useEffect(() => {
    // Request camera access
    const requestCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        setCameraError('Camera access denied. You can still capture without video.');
      }
    };

    requestCamera();

    // Cleanup on unmount
    return () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  const handleCapture = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      // Use canvas-based capture with proper options
      const blob = await captureShareImage(videoRef.current, {
        width: 1080,
        height: 1920,
        backgroundColor: '#ffffff',
        color: colorHex[color],
        suitSymbol: suitSymbols[suit],
        suitColor: suitColorsHex[suit],
        question: question,
        quality: 0.9
      });

      // Share or download
      const shared = await shareImage(blob, `gdg-riddle-${color}-${suit}.png`);
      
      if (!shared) {
        // Show success message for download
        alert('Image downloaded! You can now share it on Instagram Stories or other platforms.');
      }

    } catch (error) {
      console.error('Error capturing image:', error);
      alert('Error capturing image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Share Your Riddle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Camera Preview */}
          <div className="relative mb-6">
            <div className={`w-48 h-48 mx-auto rounded-full overflow-hidden border-4 ${colorClasses[color]} relative`}>
              {stream && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              
              {/* Suit Icon Overlay */}
              <div className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className={`text-2xl ${suitColors[suit]}`}>
                  {suitSymbols[suit]}
                </span>
              </div>
            </div>
            
            {cameraError && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {cameraError}
              </p>
            )}
          </div>

          {/* Riddle Display */}
          <div className={`p-4 rounded-lg ${colorClasses[color]} mb-6`}>
            <p className="text-gray-800 font-medium leading-relaxed">
              {question}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className={`flex-1 ${colorBgs[color]} text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              {isCapturing ? 'Capturing...' : 'Capture & Share'}
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Instructions */}
          <p className="text-xs text-gray-500 text-center mt-4">
            The captured image will be optimized for Instagram Stories (1080×1920)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareOverlay;
