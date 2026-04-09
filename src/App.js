import './App.css';
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameBoard from './components/GameBoard/GameBoard';
import Settings from './components/Settings/Settings';
import MemorizeStrategy from './components/MemorizeStrategy/MemorizeStrategy';
import Trainer from './components/MemorizeStrategy/Trainer';

function GamePage() {
  const [gameKey, setGameKey] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [numberOfDecks, setNumberOfDecks] = useState(6);
  const [buyInAmount, setBuyInAmount] = useState(1000);

  const resetGame = (newDecks, newBuyIn) => {
    setNumberOfDecks(newDecks);
    setBuyInAmount(newBuyIn);
    setGameKey(prev => prev + 1); // force re-mount
  };

  return (
    <div>
      <button className="settings-button" onClick={() => setShowSettings(true)} title='Settings'>⚙️</button>
      <Settings
        show={showSettings}
        onClose={() => setShowSettings(false)}
        onStartGame={resetGame}
        defaultDecks={numberOfDecks}
        defaultBuyIn={buyInAmount}
      />
      <GameBoard key={gameKey} numberOfDecks={numberOfDecks} startingMoney={buyInAmount} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/blackjack" element={<GamePage />} />
        <Route path="/blackjack/memorize-strategy" element={<MemorizeStrategy />} />
        <Route path="/blackjack/strategy-trainer" element={<Trainer />} />
      </Routes>
    </Router>
  )
}

export default App;
