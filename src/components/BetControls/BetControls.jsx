import { Chip } from "./Chip";
export default function BetControls({
    playerMoney,
    playerBet,
    placeBet,
    reduceBet,
    clearBet
}) {
    // const betOptions = [1, 5, 10, 25, 50, 100, 500, 1000];
    const betOptions = [5, 10, 25, 50, 100, 500, 1000];

    return (
        <div className="chip-controls">
            <div className="chips-row">
                {betOptions.map((amount) => (
                    <Chip 
                        key={amount} 
                        amount={amount} 
                        playerMoney={playerMoney} 
                        onIncrease={() => placeBet(amount)}
                        onDecrease={() => reduceBet(amount)}
                    />
                ))}
            </div>

            {/* <button onClick={() => reduceBet(1)} disabled={playerBet < 1}>
                -$1
            </button> */}
            <button onClick={() => clearBet()} disabled={playerBet === 0}>
                Clear Bet
            </button>
        </div>
    );
}
