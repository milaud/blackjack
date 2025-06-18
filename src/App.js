import './App.css';
import { useState, useEffect } from 'react';
import { createShoe } from './components/Shoe/Shoe';
import PlayerHand from './components/PlayerHand/PlayerHand';
import GameBoard from './components/GameBoard/GameBoard';

function App() {
  const numberOfDecks = 6;

  return (
    <div>
      <h1>Blackjack</h1>
      <GameBoard numberOfDecks={numberOfDecks}/>
    </div>
  );
}

export default App;
