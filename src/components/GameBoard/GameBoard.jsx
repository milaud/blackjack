import PlayerHand from '../PlayerHand/PlayerHand';
import Book from '../BookModal/Book'
import Message from '../Message/Message';
import CardCounter from '../CardCounter/CardCounter';
import BetControls from '../BetControls/BetControls';

import useBlackjackGame from '../../hooks/useBlackjackgame';
import useBetting from '../../hooks/useBetting';


export default function GameBoard({ numberOfDecks }) {

    const {
        playerMoney,
        playerBet,
        betPlaced,
        placeBet,
        reduceBet,
        clearBet,
        resolveBet,
        setBetPlaced
    } = useBetting(1000);

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
    } = useBlackjackGame(numberOfDecks, playerBet, resolveBet);

    const decksRemaining = Math.ceil(shoe.length / 52);
    const trueCount = (runningCount / decksRemaining).toFixed(2);

    const handleDealClick = async () => {
        if (playerBet <= 0) return alert('Please place a bet first.');
        setBetPlaced(true);
        resetHands();
        await dealCards();
    };

    const toggleCountCards = () => {
        setCountCards(!countCards);
    };

    return (
        <div className="game_board">
            <CardCounter countCards={countCards} runningCount={runningCount} trueCount={trueCount} shoeCount={shoe.length} toggleCountCards={toggleCountCards} />
            <Message dictionary={resultMessage} />
            <p>Player Wins: {playerWins} | Dealer Wins: {dealerWins}</p>
            <div className='book_items'>
                <button onClick={() => setShowBook(true)}>What does the Book say?</button>
                <Book
                    show={showBook}
                    cards={{ "dealer": dealerHand.at(-1), "player": playerHands[activeHandIndex] }}
                    onClose={() => setShowBook(false)}
                />
            </div>
            <p>Total Bankroll: ${playerMoney} | Current Bet: ${playerBet}</p>
            {!betPlaced && (
                <BetControls
                    playerMoney={playerMoney}
                    playerBet={playerBet}
                    placeBet={placeBet}
                    reduceBet={reduceBet}
                    clearBet={clearBet}
                    onConfirmBet={handleDealClick}
                />
            )}
            <div>
                {(gamePhase === 'start' || gamePhase === 'gameOver')
                    &&
                    <button onClick={handleDealClick} disabled={playerBet === 0}>Deal</button>}
                {(gamePhase !== 'start') && (
                    <div>
                        <PlayerHand hand={dealerHand} isDealer={!showDealerCard} />
                        <div className='player_hands'>
                            {playerHands.map((hand, i) => (
                                <PlayerHand key={i} hand={hand} activeHand={playerHands.length > 1 && activeHandIndex === i} />
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
