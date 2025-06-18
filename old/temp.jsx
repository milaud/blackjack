import React, { useState, useEffect } from 'react';

const cards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const suits = ['♤','♢','♡','♧'];

function createDeck() {
  const deck = [];
  suits.forEach(suit => cards.forEach(value => deck.push({ value, suit })));
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function calculateScore(hand) {
  let score = 0, aces = 0;
  hand.forEach(({value}) => {
    if (['J','Q','K'].includes(value)) score += 10;
    else if (value === 'A') { score += 11; aces++; }
    else score += parseInt(value);
  });
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export default function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bet, setBet] = useState(0);
  const [selectedBet, setSelectedBet] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [gameOver, setGameOver] = useState(true);
  const [showDealer, setShowDealer] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const newDeck = createDeck();
    shuffleDeck(newDeck);
    setDeck(newDeck);
  }, []);

  const deal = () => {
    if (bet <= 0) return alert('Place a bet first!');
    const d = [...deck];
    const p = [d.pop(), d.pop()];
    const de = [d.pop(), d.pop()];
    setPlayerHand(p);
    setDealerHand(de);
    setDeck(d);
    setGameOver(false);
    setShowDealer(false);
    setStatus('');
  };

  const hit = () => {
    if (gameOver) return;
    const d = [...deck];
    const p = [...playerHand, d.pop()];
    setDeck(d);
    setPlayerHand(p);
    const score = calculateScore(p);
    if (score > 21) {
      setStatus('Player Bust! You lose.');
      setTotal(total - bet);
      setGameOver(true);
    }
  };

  const stand = () => {
    const d = [...deck];
    const de = [...dealerHand];
    while (calculateScore(de) < 17) {
      de.push(d.pop());
    }
    setDealerHand(de);
    setDeck(d);
    const ps = calculateScore(playerHand);
    const ds = calculateScore(de);
    let result = '';
    if (ds > 21 || ps > ds) {
      result = 'You win!';
      setTotal(total + bet);
    } else if (ps < ds) {
      result = 'You lose.';
      setTotal(total - bet);
    } else {
      result = "It's a tie!";
    }
    setStatus(result);
    setGameOver(true);
    setShowDealer(true);
  };

  const doubleDown = () => {
    setBet(bet * 2);
    hit();
    stand();
  };

  return (
    <div>
      <h1>Blackjack</h1>
      <div style={{ color: status.includes('win') ? 'green' : status.includes('lose') ? 'red' : 'yellow' }}>
        {status}
      </div>

      <div>
        <h2>Dealer's Hand {showDealer ? `(${calculateScore(dealerHand)})` : ''}</h2>
        {dealerHand.map((c,i) => (
          <span key={i}>
            {i === 1 && !showDealer ? '[Hidden]' : `${c.value}${c.suit}`}&nbsp;
          </span>
        ))}
      </div>

      <div>
        <h2>Player's Hand ({calculateScore(playerHand)})</h2>
        {playerHand.map((c,i) => <span key={i}>{`${c.value}${c.suit} `}</span>)}
      </div>

      <div>
        <div>Current Bet: ${bet}</div>
        <div>Total Winnings: ${total}</div>
      </div>

      <div>
        <button onClick={() => setBet(bet + selectedBet)}>+</button>
        <button onClick={() => setBet(Math.max(bet - selectedBet,0))}>-</button>
        {[1,5,10,25,50,100,500,1000].map(val => (
          <button
            key={val}
            onClick={() => setSelectedBet(val)}
            style={{ fontWeight: selectedBet === val ? 'bold' : 'normal' }}
          >
            ${val}
          </button>
        ))}
        <button onClick={() => setBet(0)}>Clear Bet</button>
      </div>

      <button onClick={deal}>Deal</button>

      <div>
        <button onClick={stand} disabled={gameOver}>Stand</button>
        <button onClick={doubleDown} disabled={gameOver}>Double Down</button>
        <button onClick={hit} disabled={gameOver}>Hit</button>
      </div>

      <button onClick={() => setShowModal(true)}>Open Strategy</button>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Blackjack Strategy</h2>
            <img src="book.png" alt="Strategy" style={{ width: '100%', maxWidth: '600px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
