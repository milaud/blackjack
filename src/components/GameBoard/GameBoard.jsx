import PlayerHand from '../PlayerHand/PlayerHand';
import Book from '../BookModal/Book'
import Message from '../Message/Message';
import useBlackjackGame from '../../hooks/useBlackjackgame';
import CardCounter from '../CardCounter/CardCounter';

export default function GameBoard({ numberOfDecks }) {
    const {
        state: {
            shoe,
            playerHands,
            dealerHand,
            activeHandIndex,
            gamePhase,
            showDealerCard,
            playerWins,
            dealerWins,
            resultMessage,
            countCards,
            runningCount,
            showBook
        },
        actions: {
            dealCards,
            hit,
            stand,
            handleSplit,
            resetHands
        },
        flags: {
            canSplit
        },
        setters: {
            setCountCards,
            setShowBook
        }
    } = useBlackjackGame(numberOfDecks);

    const decksRemaining = Math.ceil(shoe.length / 52);
    const trueCount = (runningCount / decksRemaining).toFixed(2);
    
    const handleDealClick = async () => {
        resetHands();
        await dealCards();
    };

    const toggleCountCards = () => {
        setCountCards(!countCards);
    };

    /*
      TODO: 
        add options to place bets
            - enter amount to start with at the very beginning
            - enter minimum bets

        add double down buttons/logic
    */

    return (
        <div className="game_board">
            <CardCounter countCards={countCards} runningCount={runningCount} trueCount={trueCount} shoeCount={shoe.length} toggleCountCards={toggleCountCards}/>
            <p>Player Wins: {playerWins} | Dealer Wins: {dealerWins}</p>
            <div className='book_items'>
                <button onClick={() => setShowBook(true)}>What does the Book say?</button>
                <Book
                    show={showBook} 
                    cards={{"dealer": dealerHand.at(-1), "player": playerHands[activeHandIndex]}}
                    onClose={() => setShowBook(false)} 
                />
            </div>
            <Message dictionary={resultMessage} />
            <div>
                {(gamePhase === 'start' || gamePhase === 'gameOver') && <button onClick={handleDealClick}>Deal</button>}
                {(gamePhase !== 'start') && (
                    <div>
                        <PlayerHand hand={dealerHand} isDealer={!showDealerCard} />
                        <div className='player_hands'>
                            {playerHands.map((hand, i) => (
                                <PlayerHand key={i} hand={hand} activeHand={playerHands.length > 1 && activeHandIndex === i}/>
                            ))}
                        </div>
                    </div>
                )}
                {gamePhase === 'playerTurn' && (
                    <div>
                        <button onClick={hit}>Hit</button>
                        <button onClick={stand}>Stand</button>
                        {canSplit && <button onClick={handleSplit}>Split</button>}
                    </div>
                )}
            </div>
        </div>
    );
}
