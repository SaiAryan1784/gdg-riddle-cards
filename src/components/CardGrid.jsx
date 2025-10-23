import { useState } from 'react';
import ColorCard from './ColorCard';
import { getColors } from '../lib/riddles';

const CardGrid = () => {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [selectedCard, setSelectedCard] = useState(null);

  const colors = getColors();

  const handleCardFlip = (index) => {
    if (selectedCard !== null && selectedCard !== index) {
      // If another card is already selected, don't allow clicking other cards
      return;
    }

    // Set this card as selected
    setSelectedCard(index);
    
    // Flip the card after a brief delay (for grow animation)
    setTimeout(() => {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }, 400);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setFlippedCards(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-opacity duration-500 ${selectedCard === null ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
            GDG Noida
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Riddle Cards
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Choose a color to reveal a random riddle and share your moment
          </p>
        </div>

        {/* Cards Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12 ${selectedCard === null ? '' : 'relative'}`}>
          {colors.map((color, colorIndex) => (
            <ColorCard
              key={color}
              color={color}
              isFlipped={flippedCards.has(colorIndex)}
              isSelected={selectedCard === colorIndex}
              isOtherSelected={selectedCard === null ? false : selectedCard !== colorIndex}
              onFlip={() => handleCardFlip(colorIndex)}
              onReset={handleReset}
            />
          ))}
        </div>

        {/* Footer */}
        <div className={`text-center transition-opacity duration-500 ${selectedCard === null ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-500 text-sm">
            Powered by GDG Noida Community
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
