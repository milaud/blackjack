import Card from '../Deck/Card';
import { getHandDisplay } from '../../utils/gameLogic';

export default function PlayerHand({ hand, activeHand = false, isDealer = false }) {
  let header;
  isDealer ? header = "Dealer's Hand" : header = "Player's Hand"
  return (
      <div className="hand" style={{marginBottom: '1rem', border: !isDealer && activeHand ? '2px solid blue' : 'none' }}>
        <h3>{header}</h3>
        {hand.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            suit={card.suit}
            hidden={isDealer && index === 0}
          />
        ))}
        {!isDealer ? <div><strong>{getHandDisplay(hand)}</strong> </div>: null}
      </div>
  );
}