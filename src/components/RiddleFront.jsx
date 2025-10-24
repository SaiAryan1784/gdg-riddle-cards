import { useState } from 'react';
import { createPortal } from 'react-dom';
import ShareOverlay from './ShareOverlay';

const RiddleFront = ({ color, suit, question, answer, isSelected, onReset }) => {
  const [showShareOverlay, setShowShareOverlay] = useState(false);

  const colorClasses = {
    blue: 'bg-gdg-blue',
    green: 'bg-gdg-green',
    yellow: 'bg-gdg-yellow', 
    red: 'bg-gdg-red'
  };

  const suitSymbols = {
    spade: '♠',
    club: '♣',
    heart: '♥',
    diamond: '♦'
  };

  const suitColors = {
    spade: 'text-white',
    club: 'text-white',
    heart: 'text-white',
    diamond: 'text-white'
  };

  return (
    <>
      <div className={`w-full h-full rounded-2xl ${colorClasses[color]} shadow-md p-4 md:p-6 flex flex-col justify-between text-white border-2 border-gray-100`}>
        {/* Back button - only show when selected */}
        {isSelected && onReset && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg w-10 h-10 flex items-center justify-center"
              aria-label="Go back"
            >
              ←
            </button>
          </div>
        )}

        {/* Suit Icon */}
        <div className="flex justify-center items-center mb-4">
          <span className={`text-5xl md:text-6xl ${suitColors[suit]}`}>
            {suitSymbols[suit]}
          </span>
        </div>

        {/* Riddle Content */}
        <div className="flex-1 flex flex-col justify-center text-center px-2 overflow-hidden">
          <p className="text-sm md:text-base font-medium leading-snug break-words">
            {question}
          </p>
        </div>

        {/* Share Button */}
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareOverlay(true);
            }}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm md:text-base font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            📸 Share
          </button>
        </div>
      </div>

      {/* Share Overlay - Rendered using Portal to avoid width constraints */}
      {showShareOverlay && createPortal(
        <ShareOverlay
          color={color}
          suit={suit}
          question={question}
          answer={answer}
          onClose={() => setShowShareOverlay(false)}
        />,
        document.body
      )}
    </>
  );
};

export default RiddleFront;
