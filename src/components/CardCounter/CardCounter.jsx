import './CardCounter.css'

export default function CardCounter({ countCards, runningCount, trueCount, shoeCount, toggleCountCards }) {
    return (
        <div className='count_items'>
            {countCards && (
                <div>
                    <span>Running Count: {runningCount}</span>
                    <span>True Count: {trueCount}</span>
                    <span>Shoe count: {shoeCount}</span>
                </div>
            )}
            <button onClick={toggleCountCards}>
                {countCards ? 'Hide' : 'Show Card Counter'}
            </button>
        </div>
    );
}