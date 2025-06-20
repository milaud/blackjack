import Card from '../Deck/Card';
import { getHandDisplay } from '../../utils/gameLogic';

export default function PlayerHand({ hand, activeHand = false, isDealer = false }) {
  return (
      <div className="hand" style={{marginBottom: '1rem', border: !isDealer && activeHand ? '2px solid blue' : 'none' }}>
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