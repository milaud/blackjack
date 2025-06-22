import './App.css';
import GameBoard from './components/GameBoard/GameBoard';

function App() {
  const numberOfDecks = 6;

  return (
    <div>
      <h3>Blackjack</h3>
      <GameBoard numberOfDecks={numberOfDecks}/>
    </div>
  );
}

export default App;
