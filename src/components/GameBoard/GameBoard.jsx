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
        setBetPlaced,
        setPlayerBet,
        setPlayerMoney
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
            showBook,
            deckCleared
        },
        actions: {
            dealCards,
            hit,
            stand,
            doubleDown,
            handleSplit,
            resetHands,
            clearDeck
        },
        flags: {
            canSplit,
            canDoubleDown
        },
        setters: {
            setCountCards,
            setShowBook
        }
    } = useBlackjackGame(numberOfDecks, playerMoney, resolveBet, setPlayerMoney, setPlayerBet);
    
    

    const decksRemaining = Math.ceil(shoe.length / 52);
    const trueCount = (runningCount / decksRemaining).toFixed(2);

    const handleDealClick = async () => {
        if (playerBet <= 0) return alert('Please place a bet first.');
        setBetPlaced(true);
        resetHands();
        await dealCards(playerBet);
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
                    cards={{ "dealer": dealerHand.at(-1), "player": playerHands[activeHandIndex]?.cards }}
                    onClose={() => setShowBook(false)}
                />
            </div>
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
                {gamePhase === 'gameOver' && !deckCleared && <button onClick={clearDeck}>Clear Deck</button>}
                {(gamePhase === 'start' || gamePhase === 'gameOver')
                    &&
                    <button onClick={handleDealClick} disabled={playerBet === 0}>Deal</button>}
                {(!deckCleared && gamePhase !== 'start') && (
                    <div>
                        <div>
                            <h3>Dealer's Hand</h3>
                            <PlayerHand hand={dealerHand} isDealer={true} showDealerCard={!showDealerCard} />
                        </div>
                        <div>
                            <h3>Player's Hand</h3>
                            <p>Total Bets: ${playerBet}</p>
                            <div className='player_hands'>
                                {playerHands.map((hand, i) => (
                                    <PlayerHand key={i} hand={hand.cards} bet={hand.bet} activeHand={playerHands.length > 1 && activeHandIndex === i} />
                                ))}
                            </div>
                         </div>
                    </div>
                )}
                {gamePhase === 'playerTurn' && (
                    <div>
                        <button onClick={() => hit(false)}>Hit</button>
                        {canDoubleDown && <button onClick={doubleDown}>Double Down</button>}
                        <button onClick={stand}>Stand</button>
                        {canSplit && <button onClick={handleSplit}>Split</button>}
                    </div>
                )}
                <div className='player_bank_info'>
                    <span>Total Bankroll: ${playerMoney}</span> 
                    {(gamePhase === 'start' || gamePhase === 'gameOver') && <span>Current Bet: ${playerBet}</span>}
                </div>
            </div>
        </div>
    );
}
