import { useState, useEffect } from "react";

import PlayerHand from '../PlayerHand/PlayerHand';
import Book from '../BookModal/Book'
import Message from '../Message/Message';
import CardCounter from '../CardCounter/CardCounter';
import BetControls from '../BetControls/BetControls';
import GameStats from "../GameStats/GameStats";

import useBlackjackGame from '../../hooks/useBlackjackgame';
import useBetting from '../../hooks/useBetting';
import './GameBoard.css'

import { GamePhases } from '../../constants/gamePhases';


export default function GameBoard({ numberOfDecks, startingMoney }) {
    const [selectedChip, setSelectedChip] = useState(50);
    const [trueCount, setTrueCount] = useState(0);

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
    } = useBetting(startingMoney);

    const {
        state: {
            shoe,
            playerHands,
            dealerHand,
            activeHandIndex,
            gamePhase,
            showDealerCard,
            gameHistory,
            resultMessage,
            countCards,
            runningCount,
            showBook,
            deckCleared,
            showStats
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
            setShowBook,
            setShowStats
        }
    } = useBlackjackGame(numberOfDecks, playerMoney, resolveBet, setPlayerMoney, setPlayerBet);

    // const decksRemaining = Math.ceil(shoe.length / 52);
    // const decksRemaining = shoe.length / 52;
    // const trueCount = (runningCount / decksRemaining).toFixed(2);

    const handleDealClick = async () => {
        if (playerBet <= 0) return alert('Please place a bet first.');
        setBetPlaced(true);
        resetHands();
        await dealCards(playerBet);
    };

    const toggleCountCards = () => {
        setCountCards(!countCards);
    };

    useEffect(() => {
        if (shoe.length === 0) return;
        const decksRemaining = shoe.length / 52;
        const calculatedTrueCount = (runningCount / decksRemaining).toFixed(2);
        setTrueCount(calculatedTrueCount);
    }, [shoe, runningCount]);

    return (
        <div>
            <div className="game_info">
                <Message dictionary={resultMessage} />
                <CardCounter countCards={countCards} runningCount={runningCount} trueCount={trueCount} shoeCount={shoe.length} toggleCountCards={toggleCountCards} />
            </div>
            <div className='bottom-right-buttons'>
                <button onClick={() => setShowBook(true)}>♠️</button>
                <button onClick={toggleCountCards}>🃏</button>
                <button className="stats-button" onClick={() => setShowStats(true)}>📊</button>
            </div>
            <div className="game_container">
                <div className="game_board">
                    <div className='bet_controls'>
                        {!betPlaced && (
                            <BetControls
                                playerMoney={playerMoney}
                                playerBet={playerBet}
                                placeBet={placeBet}
                                reduceBet={reduceBet}
                                clearBet={clearBet}
                                selectedChip={selectedChip}
                                setSelectedChip={setSelectedChip}
                            />
                        )}
                        <div>
                            {(gamePhase === GamePhases.START || gamePhase === GamePhases.GAME_OVER) && <span>Current Bet: ${playerBet}</span>}
                        </div>
                        {gamePhase === GamePhases.GAME_OVER && !deckCleared && <button onClick={clearDeck}>Clear Deck</button>}
                        {(gamePhase === GamePhases.START || gamePhase === GamePhases.GAME_OVER)
                            &&
                            <button onClick={handleDealClick} disabled={playerBet === 0}>Deal</button>}
                    </div>
                    {(!deckCleared && gamePhase !== GamePhases.START) && (
                        <div className='hands'>
                            <div className="dealer_section fixed-card-area">
                                <h3>Dealer's Hand</h3>
                                <PlayerHand hand={dealerHand} isDealer={true} showDealerCard={!showDealerCard} />
                            </div>
                            <div className="player_section fixed-card-area">
                                <h3>Player's Hand</h3>
                                <p>Total Bets: ${playerBet}</p>
                                <div className='player_hands'>
                                    {/* <div> */}
                                    {playerHands.map((hand, i) => (
                                        <PlayerHand key={i} hand={hand.cards} bet={hand.bet} activeHand={playerHands.length > 1 && activeHandIndex === i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {gamePhase === GamePhases.PLAYER_TURN && (
                        // <div className="action_buttons">
                        <div>
                            <button onClick={() => hit(false)}>Hit</button>
                            {canDoubleDown && <button onClick={doubleDown}>Double Down</button>}
                            <button onClick={stand}>Stand</button>
                            {canSplit && <button onClick={handleSplit}>Split</button>}
                        </div>
                    )}
                </div>
                <div className='player_bank_info'>
                    <span>Total Bankroll: ${playerMoney}</span>
                </div>
            </div>
            {showStats && (
                <GameStats
                    show={showStats}
                    history={gameHistory} // or whatever prop/state you're using to track past hands
                    onClose={() => setShowStats(false)}
                />
            )}
            <Book
                show={showBook}
                // cards={{ "dealer": dealerHand.at(-1), "player": playerHands[activeHandIndex]?.cards }}
                cards={{ "dealer": dealerHand[1], "player": playerHands[activeHandIndex]?.cards }}
                onClose={() => setShowBook(false)}
            />
        </div>
    );
}
