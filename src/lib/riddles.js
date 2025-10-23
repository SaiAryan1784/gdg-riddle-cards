// GDG Noida Riddle Cards - Riddles Data
export const riddles = {
  blue: {
    spade: {
      question: "I speak without a mouth and hear without ears. What am I?",
      answer: "Echo"
    },
    club: {
      question: "Light as a feather, strongest man can't hold me long. What am I?",
      answer: "Breath"
    },
    heart: {
      question: "Cities but no houses, forests but no trees, water but no fish. What am I?",
      answer: "Map"
    },
    diamond: {
      question: "The more you take, the more you leave behind. What are they?",
      answer: "Footsteps"
    }
  },
  green: {
    spade: {
      question: "Tall when young, short when old. What am I?",
      answer: "Candle"
    },
    club: {
      question: "I can be cracked, made, told, and played. What am I?",
      answer: "Joke"
    },
    heart: {
      question: "I have keys but no locks... What am I?",
      answer: "Keyboard"
    },
    diamond: {
      question: "I fly without wings, I cry without eyes. What am I?",
      answer: "Cloud"
    }
  },
  yellow: {
    spade: {
      question: "Travels around the world but stays in a corner. What is it?",
      answer: "Stamp"
    },
    club: {
      question: "Poor people have it; rich need it; if you eat it you die. What is it?",
      answer: "Nothing"
    },
    heart: {
      question: "Must be broken before you can use it. What is it?",
      answer: "Egg"
    },
    diamond: {
      question: "No voice yet sometimes sings; no heart yet sometimes weeps. What am I?",
      answer: "Violin"
    }
  },
  red: {
    spade: {
      question: "Always hungry; must be fed; touches you and turns you red. What am I?",
      answer: "Fire"
    },
    club: {
      question: "The more there is, the less you see. What is it?",
      answer: "Darkness"
    },
    heart: {
      question: "Forward I'm heavy; backward I'm not. What am I?",
      answer: "Ton"
    },
    diamond: {
      question: "Many keys but can't open a single lock. What am I?",
      answer: "Piano"
    }
  }
};

// Helper function to get a random riddle for a given color
export const getRandomRiddle = (color) => {
  const colorRiddles = riddles[color];
  const suits = Object.keys(colorRiddles);
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  
  return {
    suit: randomSuit,
    ...colorRiddles[randomSuit]
  };
};

// Helper function to get all available colors
export const getColors = () => Object.keys(riddles);

// Helper function to get all available suits
export const getSuits = () => ['spade', 'club', 'heart', 'diamond'];
