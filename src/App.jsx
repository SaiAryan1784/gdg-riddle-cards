import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CardGrid from './components/CardGrid';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <CardGrid />
      )}
    </div>
  );
}

export default App;
