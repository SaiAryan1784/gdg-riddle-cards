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
        <div className={`absolute inset-0 backface-hidden rounded-2xl ${colorClasses[color]} shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-gray-100`}>
          <div className="text-white text-center p-4">
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </div>
            <div className="text-sm md:text-base opacity-90 font-medium">
              Tap to reveal
            </div>
          </div>
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
