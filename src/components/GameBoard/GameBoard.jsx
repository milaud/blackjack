// GameBoard.jsx
import { useState } from 'react';
import { createShoe } from '../Shoe/Shoe';
import PlayerHand from '../PlayerHand/PlayerHand';

export default function GameBoard({numberOfDecks}) {
  const [shoe, setShoe] = useState(createShoe(numberOfDecks));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealt, setDealt] = useState(false);
  const [revealDealerCard, setRevealDealerCard] = useState(false);


  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//   const duration = 850;
  const duration = 0;


  const dealCards = async () => {
    const newShoe = [...shoe];
    const newPlayerHand = [];
    const newDealerHand = [];

    newPlayerHand.push(newShoe.pop());
    setPlayerHand([...newPlayerHand]);
    await delay(duration);

    newDealerHand.push(newShoe.pop());
    setDealerHand([...newDealerHand]);
    await delay(duration);

    newPlayerHand.push(newShoe.pop());
    setPlayerHand([...newPlayerHand]);
    await delay(duration);

    newDealerHand.push(newShoe.pop());
    setDealerHand([...newDealerHand]);
    if (newShoe.length < 0.4 * 52 * numberOfDecks) {
        alert("Reshuffling shoe...");
        newShoe = createShoe(numberOfDecks);
    }
    setShoe(newShoe);
  }


  return (
    <div class="game_board">
        <p>Shoe count: {shoe.length}</p>
      <button onClick={dealCards}>Deal</button>
      {/* <button onClick={() => setRevealDealerCard(true)}>Stand</button> */}
      <div>
        <h2>Dealer's Hand</h2>
        <PlayerHand hand={dealerHand} isDealer={!revealDealerCard}/>
      </div>

      <div>
        <h2>Player's Hand</h2>
        <PlayerHand hand={playerHand} />
      </div>
    </div>
  );
}
