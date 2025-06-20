import Card from '../Deck/Card';
import { getHandDisplay } from '../../utils/gameLogic';

/*
Status: 0=playing/push, 1=win, -1=loss
*/
export default function PlayerHand({ hand, bet, status=0, activeHand = false, showDealerCard = false, isDealer = false }) {
  let header;
  isDealer ? header = "Dealer's Hand" : header = "Player's Hand"
  return (
      <div className="hand" style={{marginBottom: '1rem', border: !isDealer && activeHand ? '2px solid blue' : 'none' }}>
        {hand.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            suit={card.suit}
            hidden={showDealerCard && index === 0}
          />
        ))}
        {isDealer && !showDealerCard ? <div><strong>{getHandDisplay(hand)}</strong></div> : null }
        {!isDealer ?
          <div>
            <strong>{getHandDisplay(hand)}</strong>
            <p>${bet}</p>
          </div>
          : null
        }
      </div>
  );
}