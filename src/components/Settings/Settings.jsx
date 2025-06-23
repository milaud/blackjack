import { useState } from 'react';
import './Settings.css';

export default function Settings({ show, onClose, onStartGame, defaultDecks = 6, defaultBuyIn = 1000 }) {
    const [numDecks, setNumDecks] = useState(defaultDecks);
    const [buyIn, setBuyIn] = useState(defaultBuyIn);

    if (!show) return null;

    const handleStart = () => {
        const safeDecks = Math.max(1, numDecks);
        const safeBuyIn = Math.max(5, buyIn);
        onStartGame(safeDecks, safeBuyIn);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Game Settings</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <label>
                        Number of Decks:
                        <input
                            type="number"
                            value={numDecks}
                            min={1}
                            max={8}
                            onChange={(e) => setNumDecks(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Buy-in Amount:
                        <input
                            type="number"
                            value={buyIn}
                            min={1}
                            onChange={(e) => setBuyIn(Number(e.target.value))}
                        />
                    </label>
                    <button className="start-button" onClick={handleStart}>
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}
