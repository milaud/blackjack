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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

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

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 480);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <div className="game_info">
                <Message dictionary={resultMessage} />
                <CardCounter countCards={countCards} runningCount={runningCount} trueCount={trueCount} shoeCount={shoe.length} toggleCountCards={toggleCountCards} />
            </div>
            <div className='bottom-right-buttons'>
                <button onClick={() => setShowBook(true)} title="Show Strategy Book">♠️</button>
                <button onClick={toggleCountCards} title="Toggle Card Counting Info">🃏</button>
                <button className="stats-button" onClick={() => setShowStats(true)} title="Show Hand History">📊</button>
            </div>
            <div className="game_container">
                <div className="game_board">
                    <div className='bet_controls'>
                        {(gamePhase === GamePhases.START || deckCleared) && !betPlaced && (
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
                        
                        {(gamePhase === GamePhases.START || (deckCleared && gamePhase === GamePhases.GAME_OVER)) && <div className="current_bet"><h4>Current Bet: ${playerBet}</h4></div>}
                        {gamePhase === GamePhases.GAME_OVER && !deckCleared && <button className="vegas-button" onClick={clearDeck}>Clear Deck</button>}
                        {(gamePhase === GamePhases.START || (deckCleared && gamePhase === GamePhases.GAME_OVER))
                            &&
                            <button className="vegas-button" onClick={handleDealClick} disabled={playerBet === 0}>Deal</button>}
                    </div>
                    {(!deckCleared && gamePhase !== GamePhases.START) && (
                        <div className='hands'>
                            <div className="dealer_section fixed-card-area">
                                <h3>Dealer's Hand</h3>
                                <PlayerHand hand={dealerHand} isDealer={true} showDealerCard={!showDealerCard} />
                            </div>
                            <div className="player_section fixed-card-area">
                                <div className="player_section_header">
                                    <h3>Player's Hand</h3>
                                    <p>Total Bets: ${playerBet}</p>
                                </div>
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
                        <div className="action_buttons">
                            {/* <div> */}
                            <button className="vegas-button" onClick={() => hit(false)}>Hit</button>
                            {canDoubleDown && <button id="double_down" className="vegas-button" onClick={doubleDown}>{isMobile ? '2x' : 'Double Down'}</button>}
                            {canSplit && <button className="vegas-button" onClick={handleSplit}>Split</button>}
                            <button className="vegas-button" onClick={stand}>Stand</button>
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
