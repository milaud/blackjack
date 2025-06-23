import './Chip.css'

export function Chip ({amount, selected, onClick}) {
    return (
        <div className="chip-container">
            {/* <button className="chip-button" disabled={playerMoney < amount} onClick={onIncrease}>+</button> */}
            <div className={`chip-circle chip-${amount} ${selected ? 'selected' : ''}`} onClick={onClick}>{amount}</div>
            {/* <button className="chip-button" disabled={playerMoney < amount} onClick={onDecrease}>−</button> */}
        </div>
    );
}