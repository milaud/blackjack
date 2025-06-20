export function Chip ({amount, playerMoney, onIncrease, onDecrease}) {
    return (
        <div className="chip-container">
            <button className="chip-button" disabled={playerMoney < amount} onClick={onIncrease}>+</button>
            <div className={`chip-circle chip-${amount}`}>{amount}</div>
            <button className="chip-button" disabled={playerMoney < amount} onClick={onDecrease}>−</button>
        </div>
    );
}