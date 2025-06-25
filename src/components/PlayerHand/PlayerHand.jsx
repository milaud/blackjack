import './PlayerHand.css'
import Card from '../Deck/Card';
import { getHandDisplay } from '../../utils/helpers';

/*
Status: 0=playing/push, 1=win, -1=loss
*/
export default function PlayerHand({ hand, bet, status = 0, activeHand = false, showDealerCard = false, isDealer = false }) {
  return (
    <div className={`hand ${!isDealer && activeHand ? 'active' : ''}`}>
      <div className="hand_container">
        {hand.map((card, index) => (
        <Card
          key={index}
          value={card.value}
          suit={card.suit}
          hidden={showDealerCard && index === 0}
        />
      ))}
      </div>
      {isDealer && !showDealerCard ? <div><strong>{getHandDisplay(hand)}</strong></div> : null}
      {!isDealer ?
        <div className='hand_info'>
          <div><strong>{getHandDisplay(hand)}</strong></div>
          <div><span>${bet}</span></div>
        </div>
        : null
      }
    </div>
  );
}