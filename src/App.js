import './App.css';
import { useState } from 'react';

import GameBoard from './components/GameBoard/GameBoard';
import Settings from './components/Settings/Settings';

function App() {
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
      {/* <div className='top-right-buttons'> */}
      <button className="settings-button" onClick={() => setShowSettings(true)}>⚙️</button>
      {/* <button className="top-right-buttons" onClick={() => setShowSettings(true)}>⚙️</button> */}
      {/* <button onClick={() => setShowSettings(true)}>⚙️</button> */}
      <Settings
        show={showSettings}
        onClose={() => setShowSettings(false)}
        onStartGame={resetGame}
        defaultDecks={numberOfDecks}
        defaultBuyIn={buyInAmount}
      />
      {/* </div> */}
      <GameBoard key={gameKey} numberOfDecks={numberOfDecks} startingMoney={buyInAmount} />

    </div>
  );
}

export default App;
