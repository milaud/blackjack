import { useState } from 'react';
import { createShoe } from '../components/Shoe/Shoe';
import { checkInitialBlackjack, evaluateHands } from '../utils/gameLogic';
import { calculateHandValue, calculateWinLoss } from '../utils/helpers';
import useCardCounter from './useCardCounter';
import { GamePhases } from '../constants/gamePhases';

export default function useBlackjackGame(numberOfDecks, playerMoney, resolveBet, setPlayerMoney, setPlayerBet) {
    const [shoe, setShoe] = useState(createShoe(numberOfDecks));
    const [playerHands, setPlayerHands] = useState([{ cards: [], bet: 0, status: 0 }]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [gamePhase, setGamePhase] = useState(GamePhases.START);
    const [showDealerCard, setShowDealerCard] = useState(false);
    const [resultMessage, setResultMessage] = useState({});
    const [showBook, setShowBook] = useState(false);
    const [deckCleared, setDeckCleared] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);
    const [showStats, setShowStats] = useState(false);
    // const [cutCardIndex, setCutCardIndex] = useState(shoe.length - Math.floor(shoe.length * (0.7 + Math.random() * 0.15)));

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const duration = 850;

    const {
        countCards,
        runningCount,
        setCountCards,
        setRunningCount,
        updateCount
    } = useCardCounter();

    const revealDealerCard = (show, dealerCard = null) => {
        setShowDealerCard(show);
        if (show) {
            if (!dealerCard) {
                dealerCard = dealerHand[0];
            }
            updateCount([dealerCard]);
        }
    };

    /*
    const updateBet = (index, newBet) => {
        setPlayerHands(hands => {
            hands.map((hand, i) => {
                // this copies over the previous object (cards, bet, etc..), and then we overwrite bet
                i === index ? {...hand.cards, bet: newBet } : hand
            })
        })
    }

    const updateStatus = (index, newStatus) => {
        setPlayerHands(hands => {
            hands.map((hand, i) => {
                // this copies over the previous object (cards, bet, etc..), and then we overwrite status
                i === index ? {...hand.cards, status: newStatus } : hand
            })
        })
    }

    // combine the above two?
    // updatePlayerHand(0, { bet: 100, status: 1 });
    const updatePlayerHand = (index, updates) => {
        setPlayerHands(prev =>
            prev.map((player, i) =>
                i === index ? { ...player, ...updates } : player
            )
        );
    };
    */
    

    const dealCards = async (initialBet) => {
        setGamePhase(GamePhases.DEALING);
        let newShoe = [...shoe];
        // if (shoe.length <= cutCardIndex) {
        if (shoe.length < 0.4 * 52 * numberOfDecks) {
            setResultMessage({ message: 'Reshuffling shoe...', color: 0 });
            await delay(3000);
            newShoe = createShoe(numberOfDecks);
            setRunningCount(0);
            setResultMessage({ message: '', color: 0 });
            // setCutCardIndex(newShoe.length - Math.floor(newShoe.length * (0.7 + Math.random() * 0.15)))
        }

        const playerCards = [];
        const newDealerHand = [];

        playerCards.push(newShoe.pop());
        updateCount([playerCards[0]]);
        setPlayerHands([{ cards: [...playerCards], bet: initialBet}]);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        setDealerHand([...newDealerHand]);
        await delay(duration);

        playerCards.push(newShoe.pop());
        updateCount([playerCards[1]]);
        setPlayerHands([{ cards: [...playerCards], bet: initialBet}]);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        updateCount([newDealerHand[1]]);
        setDealerHand([...newDealerHand]);
        await delay(duration);

        setShoe(newShoe);

        const outcome = checkInitialBlackjack({ cards: playerCards, bet: initialBet }, newDealerHand);
        if (outcome.blackjack) {
            setPlayerHands([outcome.updatedHand]);
            revealDealerCard(true, newDealerHand[0]);
            setResultMessage(outcome.result);
            setGamePhase(GamePhases.GAME_OVER);
            resolveBet([outcome.updatedHand]);
            const newGameResult = {
                playerHands: [{
                    cards: [...outcome.updatedHand.cards],
                    bet: outcome.updatedHand.bet,
                    outcome: outcome.updatedHand.status,
                    net: calculateWinLoss([outcome.updatedHand]),
                }],
                dealerHand: [...newDealerHand],
            }
            setGameHistory(prev => [
                ...prev, newGameResult
            ]);
            return;
        }

        setGamePhase(GamePhases.PLAYER_TURN);
        setActiveHandIndex(0);
    };

    const hit = (doubleDown = false) => {
        const newShoe = [...shoe];
        const card = newShoe.pop();
        updateCount([card]);
        const newHands = [...playerHands];
        newHands[activeHandIndex].cards.push(card);
        setPlayerHands(newHands);
        setShoe(newShoe);

        if (doubleDown) {
            stand();
        }

        if (calculateHandValue(newHands[activeHandIndex].cards) >= 21) {
            if (activeHandIndex < playerHands.length - 1) {
                setActiveHandIndex(activeHandIndex + 1);
            } else {
                stand();
            }
        }
    };

    const canDoubleDown = () => {
        if (gamePhase !== GamePhases.PLAYER_TURN) return false;
        return playerHands[activeHandIndex].cards.length === 2 && playerMoney >= playerHands[activeHandIndex].bet;
    };

    const doubleDown = () => {
        if (!canDoubleDown()) return;
        const hands = [...playerHands];
        hands[activeHandIndex].bet *= 2;
        setPlayerMoney(prev => prev - playerHands[activeHandIndex].bet / 2);
        setPlayerBet(prev => prev + playerHands[activeHandIndex].bet / 2)
        setPlayerHands(hands);
        hit(true);
    };

    const stand = async () => {
        if (activeHandIndex < playerHands.length - 1) {
            setActiveHandIndex(activeHandIndex + 1);
            return;
        }
        setGamePhase(GamePhases.DEALER_TURN);
        revealDealerCard(true);
        let newShoe = [...shoe];
        let newDealerHand = [...dealerHand];

        while (calculateHandValue(newDealerHand) < 17) {
            await delay(duration);
            const card = newShoe.pop();
            newDealerHand.push(card);
            updateCount([card]);
            setDealerHand([...newDealerHand]);
        }
        setShoe(newShoe);
        await delay(duration);
        const outcome = evaluateHands(playerHands, newDealerHand);
        setPlayerHands(outcome.updatedHands);
        setResultMessage(outcome.result);
        setGamePhase(GamePhases.GAME_OVER);
        resolveBet(outcome.updatedHands);
        const newGameResult = {
            playerHands: outcome.updatedHands.map(h => ({
                cards: h.cards,
                bet: h.bet,
                outcome: h.status,
                net: calculateWinLoss([h]),
            })),
            dealerHand: newDealerHand,
        }
        setGameHistory(prev => [
            ...prev, newGameResult
        ]);
    };

    const canSplit = () => {
        if (gamePhase !== GamePhases.PLAYER_TURN) return false;
        const hand = playerHands[activeHandIndex].cards;
        return hand.length === 2 && hand[0].value === hand[1].value && playerMoney >= playerHands[activeHandIndex].bet;
    };

    const handleSplit = () => {
        if (!canSplit()) return;
        const newShoe = [...shoe];
        const hands = [...playerHands];
        const current = hands[activeHandIndex];

        const hand1 = { cards: [current.cards[0], newShoe.pop()], bet: current.bet };
        const hand2 = { cards: [current.cards[1], newShoe.pop()], bet: current.bet };

        updateCount([hand1.cards[1], hand2.cards[1]]);
        setPlayerMoney(prev => prev - current.bet);
        setPlayerBet(prev => prev + current.bet)

        hands.splice(activeHandIndex, 1, hand1, hand2);
        setPlayerHands(hands);
        setShoe(newShoe);
    };

    const resetHands = () => {
        setPlayerHands([{ cards: [], bet: 0 }]);
        setDealerHand([]);
        revealDealerCard(false);
        setResultMessage({ message: '' });
        setActiveHandIndex(0)
        setDeckCleared(false);
    };

    const clearDeck = () => {
        setPlayerHands([{ cards: [], bet: 0 }]);
        setDealerHand([]);
        revealDealerCard(false);
        setDeckCleared(true);
    }

    // useEffect(() => {
    //     if (gamePhase === 'gameOver') {
    //         const timer = setTimeout(() => {
    //             clearDeck()
    //         }, 5000);

    //         return () => clearTimeout(timer); // Clean up if phase changes early
    //     }
    // }, [gamePhase]);

    return {
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
            canSplit: canSplit(),
            canDoubleDown: canDoubleDown()
        },
        setters: {
            setCountCards,
            setShowBook,
            setShowStats
        }
    };
}
