// import bookImage from './book.png'
import './Book.css';
import { useState } from 'react';
import { getHandDisplay } from '../../utils/helpers';
import { basicStrategyTable, getBlackjackStrategy } from '../../utils/book';

const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

const Cell = ({ value }) => (
    <td className={value}>{value}</td>
);

const StrategySection = ({ title, data, rowLabelPrefix, customOrder }) => {
    const rowKeys = customOrder ?? Object.keys(data);

    return (
        <div>
            <table>
                <caption>{title}</caption>
                <thead>
                    <tr>
                        <th>Player</th>
                        {dealerCards.map(card => <th key={card}>{card}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rowKeys.map(key => (
                        <tr key={key}>
                            <td>{rowLabelPrefix ? `${rowLabelPrefix}${key}` : key}</td>
                            {data[key].map((val, i) => <Cell key={i} value={val} />)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

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

const BlackjackTable = ({ cards, initialIndex = 0 }) => {
    const [tableIndex, setTableIndex] = useState(initialIndex); // 0=hard, 1=soft, 2=pairs

    const hardOrder = Object.keys(basicStrategyTable.hard).sort((a, b) => {
        if (a === '≤ 7') return -1;
        if (b === '≤ 7') return 1;
        if (a === '≥ 17') return 1;
        if (b === '≥ 17') return -1;
        return Number(a) - Number(b);
    });

    const softOrder = Object.keys(basicStrategyTable.soft).sort((a, b) => {
        const parse = v => {
            if (v === 'A,19+') return 100; // Put at end
            return parseInt(v);
        };
        return parse(a) - parse(b);
    });

    const tables = [
        <StrategySection title="Hard Totals" data={basicStrategyTable.hard} customOrder={hardOrder} />,
        <StrategySection title="Soft Totals" data={basicStrategyTable.soft} rowLabelPrefix="A," customOrder={softOrder} />,
        <StrategySection title="Pairs" data={basicStrategyTable.pairs} rowLabelPrefix="" />
    ]

    const handleLeft = () => {
        setTableIndex((prev) => (prev === 0 ? 2 : prev - 1));
    };

    const handleRight = () => {
        setTableIndex((prev) => (prev === 2 ? 0 : prev + 1));
    };
    return (
        <div className="container">
            <Legend />
            <div className="book-navigation">
                <button className="nav-button" onClick={handleLeft}>◀</button>
                {/* <span className="table-title">{tableTypes[tableIndex].toUpperCase()} TABLE</span> */}
                {tables[tableIndex]}
                <button className="nav-button" onClick={handleRight}>▶</button>
            </div>
        </div>
    );
};

export default function Book({ show, cards = null, onClose }) {
    if (!show) return null;
    let initialIndex = 0;
    const handType = ["hard", "soft", "pair of"]
    const strategyText = cards.dealer && cards.player
        ? getBlackjackStrategy(cards.dealer, cards.player)
        : '';

    if (cards.dealer && cards.player) {
        if (cards.player.length === 2 && cards.player[0].value === cards.player[1].value) initialIndex = 2;
        else if (cards.player.some(card => card.value === 'A')) initialIndex = 1;
    }
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
                        <p>Basic strategy says to <strong>{strategyText}</strong> on {handType[initialIndex]} {getHandDisplay(cards.player)}</p>
                    </div>
                    : <div></div>
                }
                {/* <img
                src={bookImage}
                alt="Blackjack Strategy"
                className="modal-image"
                /> */}

                <BlackjackTable cards={cards.player} initialIndex={initialIndex} />

            </div>
        </div>
    );
}