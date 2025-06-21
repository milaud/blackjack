import bookImage from './book.png'
import './Book.css';
import { getHandDisplay } from '../../utils/helpers';
import { basicStrategyTable, getBlackjackStrategy } from '../../utils/book';

const dealerCards = ['2','3','4','5','6','7','8','9','10','A'];

const Cell = ({ value }) => (
  <td className={value}>{value}</td>
);

const StrategySection = ({ title, data, rowLabelPrefix }) => (
  <table>
    <caption>{title}</caption>
    <thead>
      <tr>
        <th>Player</th>
        {dealerCards.map(card => <th key={card}>{card}</th>)}
      </tr>
    </thead>
    <tbody>
      {Object.entries(data).map(([key, actions]) => (
        <tr key={key}>
          <td>{rowLabelPrefix ? `${rowLabelPrefix}${key}` : key}</td>
          {actions.map((val, i) => <Cell key={i} value={val} />)}
        </tr>
      ))}
    </tbody>
  </table>
);

const Legend = () => (
  <div className="legend">
    <h3>Legend</h3>
    <ul>
      <li><span className="legend-box H">H</span> = Hit</li>
      <li><span className="legend-box S">S</span> = Stand</li>
      <li><span className="legend-box D">D</span> = Double (if allowed, else Hit)</li>
      <li><span className="legend-box P">P</span> = Split</li>
    </ul>
  </div>
);

const BlackjackTable = () => (
  <div className="container">
    <Legend />
    <StrategySection title="Hard Totals" data={basicStrategyTable.hard} />
    <StrategySection title="Soft Totals" data={basicStrategyTable.soft} rowLabelPrefix="A," />
    <StrategySection title="Pairs" data={basicStrategyTable.pairs} rowLabelPrefix="" />
  </div>
);

export default function Book({ show, cards=null, onClose }) {
    if (!show) return null;
    const strategyText = cards.dealer && cards.player 
    ? getBlackjackStrategy(cards.dealer, cards.player)
    : '';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h2>Blackjack Strategy</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                {cards.dealer && cards.player ?
                    <div>
                        <p>Dealer's showing: {cards.dealer.value}</p>
                        <p>You have: {cards.player.map(card => card.value).join(", ")} ({getHandDisplay(cards.player)})</p>
                        <p><strong>{strategyText}</strong></p>
                    </div>
                    : <div></div>
                }
                {/* <img
                src={bookImage}
                alt="Blackjack Strategy"
                className="modal-image"
                /> */}
                
                <BlackjackTable />

            </div>
        </div>
    );
}