import './BetControls.css'
import { Chip } from "./Chip";

export default function BetControls({
    playerMoney,
    playerBet,
    placeBet,
    reduceBet,
    clearBet,
    selectedChip,
    setSelectedChip
}) {
    // const betOptions = [1, 5, 10, 25, 50, 100, 500, 1000];
    const betOptions = [5, 10, 25, 50, 100, 500, 1000];

    return (
        <div className="bet-controls">
            <button onClick={() => clearBet()} disabled={playerBet === 0}>
                Clear Bet
            </button>
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
            <div className="chip-controls action_buttons">
                <button onClick={() => reduceBet(selectedChip)} disabled={playerBet < selectedChip}>
                    -
                </button>
                <button onClick={() => placeBet(selectedChip)} disabled={playerMoney < selectedChip}>
                    +
                </button>
            </div>
        </div>
    );
}
