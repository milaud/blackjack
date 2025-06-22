import { Chip } from "./Chip";
import { useState } from "react";

export default function BetControls({
    playerMoney,
    playerBet,
    placeBet,
    reduceBet,
    clearBet
}) {
    // const betOptions = [1, 5, 10, 25, 50, 100, 500, 1000];
    const betOptions = [5, 10, 25, 50, 100, 500, 1000];
    const [selectedChip, setSelectedChip] = useState(betOptions[3]);

    return (
        <div className="bet-controls">
            <div className="chip-controls">
                <button 
                    onClick={() => reduceBet(selectedChip)} 
                    disabled={playerBet < selectedChip}
                >
                    -
                </button>
                <button 
                    onClick={() => placeBet(selectedChip)} 
                    disabled={playerMoney < selectedChip}
                >
                    +
                </button>
            </div>
            <div className="chips-row">
                {betOptions.map((amount) => (
                    <Chip 
                        key={amount} 
                        amount={amount} 
                        playerMoney={playerMoney} 
                        selected={selectedChip === amount}
                        onClick={() => setSelectedChip(amount)}
                    />
                ))}
            </div>
            <button onClick={() => clearBet()} disabled={playerBet === 0}>
                Clear Bet
            </button>
        </div>
    );
}
