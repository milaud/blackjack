import './GameStats.css';
import { calculateHandValue } from '../../utils/helpers';

export default function GameStats({ show, onClose, history }) {
    if (!show) return null;

    const getResultIcon = (result) => {
        switch (result) {
            case 1: return '✅';
            case 1.5: return '💰';
            case -1: return '❌';
            case 0: return '🤝';
            // case 'mixed': return '🟡';
            default: return '❓';
        }
    };

    const getProfit = () => {
        let profit = history.flatMap(h => h.playerHands).reduce((sum, h) => sum + h.net, 0)
        if (profit > 0) return `+${profit}`;
        return profit;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box stats-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Game History</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className='win_info'>
                    <span>Wins: {history.flatMap(h => h.playerHands).filter(h => h.outcome >= 1).length}</span>
                    <span>Losses: {history.flatMap(h => h.playerHands).filter(h => h.outcome === -1).length}</span>
                    <span>Pushes: {history.flatMap(h => h.playerHands).filter(h => h.outcome === 0).length}</span>
                </div>
                <p>Profit: {getProfit()}</p>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Player Cards</th>
                            <th>Dealer Cards</th>
                            <th>Result</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((round, roundIndex) =>
                            round.playerHands.map((hand, handIndex) => (
                                <tr key={`${roundIndex}-${handIndex}`}>
                                    <td>{roundIndex + 1}</td>
                                    <td>{hand.cards.map(c => c.display || c.value).join(', ')} ({calculateHandValue(hand.cards)})</td>
                                    <td>{round.dealerHand.map(c => c.display || c.value).join(', ')} ({calculateHandValue(round.dealerHand)})</td>
                                    <td>{getResultIcon(hand.outcome)}</td>
                                    <td
                                        style={{
                                            color: hand.net > 0 ? 'green' : hand.net < 0 ? 'red' : 'gray'
                                        }}
                                    >
                                        {hand.net > 0 ? '+' : ''}{hand.net}
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
