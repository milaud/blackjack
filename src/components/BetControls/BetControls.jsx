export default function BetControls({
    playerMoney,
    playerBet,
    placeBet,
    reduceBet,
    clearBet
}) {
    const betOptions = [1, 5, 10, 25, 50, 100, 500, 1000];

    return (
        <div className="bet-controls">
            <div className="bet-buttons">
                {betOptions.map((amount) => (
                    <button
                        key={amount}
                        disabled={playerMoney < amount}
                        onClick={() => placeBet(amount)}
                    >
                        ${amount}
                    </button>
                ))}
            </div>

            <button onClick={() => reduceBet(1)} disabled={playerBet < 1}>
                -$1
            </button>
            <button onClick={() => clearBet()} disabled={playerBet === 0}>
                Clear Bet
            </button>
        </div>
    );
}
