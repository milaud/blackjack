import bookImage from './book.png'
import './Book.css';
import { getHandDisplay } from '../../utils/gameLogic';


export default function Book({ show, cards, onClose }) {
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h2>Blackjack Strategy</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <p>Dealer's showing: {cards.dealer.value}</p>
                <p>You have: {cards.player.map(card => card.value).join(", ")} ({getHandDisplay(cards.player)})</p>
                <img
                src={bookImage}
                alt="Blackjack Strategy"
                className="modal-image"
                />
            </div>
        </div>
    );
}