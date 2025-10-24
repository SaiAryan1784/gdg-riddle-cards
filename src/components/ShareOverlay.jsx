import { useState, useRef, useEffect } from 'react';
import { captureShareImage, shareImage } from '../lib/capture';

const ShareOverlay = ({ color, suit, question, onClose }) => {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [isRetryingCamera, setIsRetryingCamera] = useState(false);
  
  const videoRef = useRef(null);

  const colorClasses = {
    blue: 'border-gdg-blue bg-gdg-blue/10',
    green: 'border-gdg-green bg-gdg-green/10',
    yellow: 'border-gdg-yellow bg-gdg-yellow/10',
    red: 'border-gdg-red bg-gdg-red/10'
  };

  const riddleBgClasses = {
    blue: 'bg-gradient-to-br from-blue-800 to-blue-900',
    green: 'bg-gradient-to-br from-green-800 to-green-900',
    yellow: 'bg-gradient-to-br from-yellow-800 to-yellow-900',
    red: 'bg-gradient-to-br from-red-800 to-red-900'
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
    let localStream = null;
    
    // Request camera access with improved error handling
    const requestCamera = async () => {
      try {
        // Check if we're on HTTPS or localhost (for better error messages)
        const isSecure = window.location.protocol === 'https:' || 
                        window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
        
        if (!isSecure) {
          throw new Error('Camera requires HTTPS. Please use a secure connection for camera access.');
        }

        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported on this device');
        }

        // Request camera with more specific constraints
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640, min: 320 },
            height: { ideal: 480, min: 240 }
          },
          audio: false
        });
        
        localStream = mediaStream;
        setStream(mediaStream);
        
        // Wait for video element to be available
        const setupVideo = () => {
          if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
            
            // Set up event listeners
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
              videoRef.current.play().catch(err => {
                console.log('Auto-play failed, trying manual play:', err);
                // Try manual play after user interaction
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }, 500);
              });
            };
            
            videoRef.current.oncanplay = () => {
              console.log('Video can play, ready state:', videoRef.current.readyState);
            };
            
            videoRef.current.onerror = (e) => {
              console.error('Video error:', e);
              setCameraError('Video playback error. You can still capture without video.');
            };
          }
        };

        // Setup video immediately if ref is available, otherwise wait
        if (videoRef.current) {
          setupVideo();
        } else {
          // Wait a bit for the ref to be available
          setTimeout(setupVideo, 100);
        }
        
      } catch (error) {
        console.error('Camera access error:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Camera access denied. You can still capture without video.';
        
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. You can still capture without video.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported on this device. You can still capture without video.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is being used by another application. Please close other apps and try again.';
        }
        
        setCameraError(errorMessage);
      }
    };

    requestCamera();

    // Cleanup on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  const handleCapture = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      
      console.log('Starting capture...', {
        hasVideo: !!video,
        videoWidth: video?.videoWidth,
        videoHeight: video?.videoHeight,
        readyState: video?.readyState,
        hasStream: !!stream
      });
      
      // If video exists and isn't ready yet, wait a bit for it to load
      if (video && video.readyState < 2) {
        console.log('Video not ready, waiting...');
        // Wait up to 5 seconds for video to be ready
        const maxWaitTime = 5000;
        const startTime = Date.now();
        
        while (video.readyState < 2 && Date.now() - startTime < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('Video ready state after wait:', video.readyState);
        
        // If still not ready, try to force play
        if (video.readyState < 2) {
          console.log('Forcing video play...');
          try {
            await video.play();
            // Wait a bit more after forcing play
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (e) {
            console.log('Force play failed:', e);
          }
        }
      }
      
      // Check if we have a valid video stream
      const hasValidVideo = video && 
                           video.videoWidth > 0 && 
                           video.videoHeight > 0 && 
                           video.readyState >= 2;
      
      console.log('Video validation:', {
        hasVideo: !!video,
        hasDimensions: video?.videoWidth > 0 && video?.videoHeight > 0,
        readyState: video?.readyState,
        hasValidVideo
      });
      
      // Use canvas-based capture with proper options
      console.log('Calling captureShareImage...');
      const blob = await captureShareImage(hasValidVideo ? video : null, {
        width: 1080,
        height: 1920,
        backgroundColor: '#ffffff',
        color: colorHex[color],
        suitSymbol: suitSymbols[suit],
        suitColor: suitColorsHex[suit],
        question: question,
        quality: 0.9
      });

      console.log('Blob created:', blob ? `${blob.size} bytes` : 'null');

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Share or download
      console.log('Attempting to share/download...');
      const shared = await shareImage(blob, `gdg-riddle-${color}-${suit}.png`);
      
      console.log('Share result:', shared);
      
      if (!shared) {
        // Show success message for download
        setCaptureSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setCaptureSuccess(false);
        }, 3000);
      } else {
        setCaptureSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setCaptureSuccess(false);
        }, 3000);
      }

      // Don't close the overlay automatically - let user decide when to close
      // This prevents the card from flipping back

    } catch (error) {
      console.error('Error capturing image:', error);
      alert(`Error capturing image: ${error.message}. Please try again.`);
    } finally {
      setIsCapturing(false);
    }
  };

  const retryCamera = async () => {
    setIsRetryingCamera(true);
    setCameraError(null);
    
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request camera again
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(console.error);
      }
      
    } catch (error) {
      console.error('Camera retry failed:', error);
      setCameraError('Camera retry failed. You can still capture without video.');
    } finally {
      setIsRetryingCamera(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Prevent clicks on the backdrop from bubbling up
        e.stopPropagation();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => {
          // Prevent clicks inside the modal from bubbling up
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share Your Riddle</h2>
            <p className="text-sm text-gray-600 mt-1">Create a personalized story</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 px-6">
          {/* Camera Preview */}
          <div className="relative mb-8">
            <div className="flex justify-center">
              <div className={`w-56 h-56 rounded-full overflow-hidden border-4 ${colorClasses[color]} relative shadow-xl`}>
                {stream && !cameraError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="#9ca3af" className="mx-auto mb-2">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <p className="text-xs text-gray-500">Camera Preview</p>
                    </div>
                  </div>
                )}
                
                {/* Suit Icon Overlay */}
                <div className="absolute bottom-3 right-3 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
                  <span className={`text-3xl ${suitColors[suit]}`}>
                    {suitSymbols[suit]}
                  </span>
                </div>
              </div>
            </div>
            
            {cameraError && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center mb-3">
                  {cameraError}
                </p>
                <button
                  onClick={retryCamera}
                  disabled={isRetryingCamera}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isRetryingCamera ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Retrying...
                    </>
                  ) : (
                    <>
                      🔄 Retry Camera
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Riddle Display */}
          <div className={`p-6 rounded-2xl ${riddleBgClasses[color]} mb-8 shadow-xl border border-gray-700`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">💭</span>
              </div>
              <p className="text-white font-semibold leading-relaxed text-lg drop-shadow-sm">
                {question}
              </p>
            </div>
          </div>

          {/* Success Message */}
          {captureSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm text-green-800 font-medium">Image captured successfully!</p>
                  <p className="text-xs text-green-600 mt-1">Check your downloads or shared content</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className={`w-full ${colorBgs[color]} text-white font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3`}
            >
              {isCapturing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Capturing...
                </>
              ) : (
                <>
                  <span className="text-xl">📸</span>
                  Capture & Share
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
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
