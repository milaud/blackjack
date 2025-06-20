import './App.css';
import GameBoard from './components/GameBoard/GameBoard';

function App() {
  const numberOfDecks = 6;

  return (
    <div>
      <h2>Blackjack</h2>
      <GameBoard numberOfDecks={numberOfDecks}/>
    </div>
  );
}

export default App;
