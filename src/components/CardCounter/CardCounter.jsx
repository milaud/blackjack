import './CardCounter.css'

export default function CardCounter({ countCards, runningCount, trueCount, shoeCount, toggleCountCards }) {
    return (
        <div className='count_items'>
            {countCards && (
                <p>Running Count: {runningCount} /
                    True Count: {trueCount} /
                    Shoe count: {shoeCount}</p>
            )}
            <button onClick={toggleCountCards}>
                {countCards ? 'Hide' : 'Show Card Counter'}
            </button>
        </div>
    );
}