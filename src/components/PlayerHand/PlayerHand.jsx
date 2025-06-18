import Card from '../Deck/Card';

function calculateScore(hand) {
  let total = 0;
  let aces = 0;

  hand.forEach(card => {
    const value = card.value;
    if (['J', 'Q', 'K'].includes(value)) {
      total += 10;
    } else if (value === 'A') {
      total += 11;
      aces += 1;
    } else {
      total += parseInt(value);
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return aces > 0 ? `${total - 10}/${total}` : `${total}`;
}

export default function PlayerHand({ hand, isDealer = false }) {
  return (
      <div className="hand">
        {hand.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            suit={card.suit}
            hidden={isDealer && index === 0}
          />
        ))}
        {!isDealer ? <div><strong>{calculateScore(hand)}</strong> </div>: null}
      </div>
  );
}