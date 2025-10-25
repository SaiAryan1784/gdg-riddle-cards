// GDG Noida Riddle Cards - Riddles Data
export const riddles = {
  blue: {
    spade: {
      question: "🏙 I happen once a year, with talks, code, and cheer. Noida's geeks all gather near, what event brings them here?",
      answer: ""
    },
    club: {
      question: "🎁 You code, you learn, you might win a prize, But community spirit is the ultimate rise. I'm more than a fest, I'm a family vibe, Who am I, where coders thrive?",
      answer: ""
    },
    heart: {
      question: "🌐 I'm the web's best mate, lightning fast and sleek, Built by Google, guess my physique?",
      answer: ""
    },
    diamond: {
      question: "☁ I live in the cloud, with data to spare, Run your apps, train AI I'm everywhere.",
      answer: ""
    }
  },
  green: {
    spade: {
      question: "📱 I live inside your pocket, where apps reside, An open playground with Google pride.",
      answer: ""
    },
    club: {
      question: "🗺 I guide your path from start to end, Turn-by-turn, your digital friend.",
      answer: ""
    },
    heart: {
      question: "💬 I let your code speak to APIs and brains, Understanding words through data and chains",
      answer: ""
    },
    diamond: {
      question: " AI research is my game, Data flows to train my brain",
      answer: ""
    }
  },
  yellow: {
    spade: {
      question: " I answer billions every day, Just type your thoughts, I'll show the way.",
      answer: ""
    },
    club: {
      question: "💻 We meet, we code, we share the flame, Digital trendsetter all in the game Google backed, guess our name",
      answer: ""
    },
    heart: {
      question: "🚀 Build once, deploy to web and phone, My widgets make UI your own.",
      answer: ""
    },
    diamond: {
      question: " I set the tone, I light the day, Speakers and cheers pave the way. Before all sessions start their spree, Where's the spotlight meant to be?",
      answer: ""
    }
  },
  red: {
    spade: {
      question: " I'm everyone's favorite stop in line, T-shirts, stickers, bottles all divine. You'll spot smiles, not stress, Guess this queue of happiness!",
      answer: ""
    },
    club: {
      question: " I frame your smile, your crew, your zest, Memories made, you strike your best. Props and backdrops, lights so cool. What corner makes Insta rule?",
      answer: ""
    },
    heart: {
      question: " You see them run, yet calm and bright, Managing chaos with all their might. Without them, events can't flow, Who are these heroes you should know?",
      answer: ""
    },
    diamond: {
      question: " I'm not a lecture, I make you try, Hands-on learning, give it a fly! Code or design, you'll do the rest, What's this practical part of the fest?",
      answer: ""
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
