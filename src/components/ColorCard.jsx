import { useState } from 'react';
import { getRandomRiddle } from '../lib/riddles';
import RiddleFront from './RiddleFront';

const ColorCard = ({ color, isFlipped, isSelected, isOtherSelected, onFlip, onReset }) => {
  const [riddle, setRiddle] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const colorClasses = {
    blue: 'bg-gdg-blue',
    green: 'bg-gdg-green', 
    yellow: 'bg-gdg-yellow',
    red: 'bg-gdg-red'
  };

  const colorImages = {
    blue: '/B1.png',
    green: '/G1.png',
    yellow: '/Y1.png',
    red: '/R1.png'
  };

  const handleClick = () => {
    if (isAnimating || isOtherSelected) return;
    
    setIsAnimating(true);
    
    if (!isFlipped && !isSelected) {
      // Generate riddle on first flip
      const newRiddle = getRandomRiddle(color);
      setRiddle(newRiddle);
    }
    
    onFlip();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div 
      className={`perspective-1000 transition-all duration-500 ease-out ${
        isSelected 
          ? 'fixed inset-0 z-50 flex items-center justify-center cursor-default' 
          : isOtherSelected 
            ? 'opacity-0 pointer-events-none scale-50' 
            : 'cursor-pointer'
      } ${isAnimating ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isOtherSelected ? -1 : 0}
      aria-label={`${color} card`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div 
        className={`relative preserve-3d transition-all duration-600 ease-in-out ${
          isFlipped ? 'rotate-y-180' : ''
        } ${
          isSelected 
            ? 'w-80 h-96 md:w-96 md:h-[32rem]' 
            : 'w-full h-48 md:h-56'
        }`}
        style={{
          transitionDuration: prefersReducedMotion ? '0ms' : '600ms'
        }}
      >
        {/* Card Back */}
        <div className={`absolute inset-0 backface-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 overflow-hidden`}>
          <img 
            src={colorImages[color]} 
            alt={`${color} card`}
            className="w-full h-full object-cover"
            style={{
              imageRendering: 'pixelated',
              imageRendering: '-moz-crisp-edges',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {riddle && (
            <RiddleFront 
              color={color}
              suit={riddle.suit}
              question={riddle.question}
              answer={riddle.answer}
              isSelected={isSelected}
              onReset={onReset}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
