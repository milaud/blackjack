import Card from '../Deck/Card';
import { getHandDisplay } from '../../utils/helpers';

/*
Status: 0=playing/push, 1=win, -1=loss
*/
export default function PlayerHand({ hand, bet, status=0, activeHand = false, showDealerCard = false, isDealer = false }) {
  return (
      <div className="hand" style={{border: !isDealer && activeHand ? '2px solid blue' : 'none' }}>
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
          <div className='hand_info'>
            <strong>{getHandDisplay(hand)}</strong>
            <span>${bet}</span>
          </div>
          : null
        }
      </div>
  );
}