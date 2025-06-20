import { useState } from 'react';
import { createShoe } from '../components/Shoe/Shoe';
import { calculateHandValue } from '../utils/gameLogic';
import { getCardCountValue } from '../utils/helpers';

export default function useBlackjackGame(numberOfDecks, playerMoney, resolveBet, setPlayerMoney, setPlayerBet) {
    const [shoe, setShoe] = useState(createShoe(numberOfDecks));
    const [playerHands, setPlayerHands] = useState([{ cards: [], bet: 0 }]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [gamePhase, setGamePhase] = useState('start');
    const [showDealerCard, setShowDealerCard] = useState(false);
    const [playerWins, setPlayerWins] = useState(0);
    const [dealerWins, setDealerWins] = useState(0);
    const [resultMessage, setResultMessage] = useState({});
    const [countCards, setCountCards] = useState(false);
    const [runningCount, setRunningCount] = useState(0);
    const [showBook, setShowBook] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const duration = 850;

    const updateCount = (cards) => {
        let delta = 0;
        cards.forEach(card => {
            delta += getCardCountValue(card);
        });
        setRunningCount(prev => prev + delta);
    };

    const showDealerCardUtil = (show, dealerCard = null) => {
        setShowDealerCard(show);
        if (show) {
            if (!dealerCard) {
                dealerCard = dealerHand[0];
            }
            updateCount([dealerCard]);
        }
    };

    const checkInitialBlackjack = (playerHandObj, newDealerHand) => {
        const playerTotal = calculateHandValue(playerHandObj.cards);
        const dealerTotal = calculateHandValue(newDealerHand);
        let result = {};
        let netPayout = 0;

        if (playerTotal === 21 || dealerTotal === 21) {
            showDealerCardUtil(true, newDealerHand[0]);
            if (playerTotal === 21 && dealerTotal === 21) {
                result = { message: 'Push! Both have Blackjack.', color: 0 };
                netPayout = playerHandObj.bet;
            } else if (playerTotal === 21) {
                result = { message: 'Blackjack! Player wins!', color: 1 };
                setPlayerWins(prev => prev + 1);
                netPayout = playerHandObj.bet * 2.5;
            } else {
                result = { message: 'Dealer has Blackjack!', color: -1 };
                setDealerWins(prev => prev + 1);
                netPayout = 0;
            }
            setResultMessage(result);
            setGamePhase('gameOver');
            resolveBet(netPayout);
            return true;
        }
        return false;
    };

    const evaluateHands = (finalDealerHand) => {
        const dealerTotal = calculateHandValue(finalDealerHand);
        let playerWinCount = 0;
        let dealerWinCount = 0;
        let totalPayout = 0;

        playerHands.forEach(({ cards, bet }) => {
            const playerTotal = calculateHandValue(cards);
            if (playerTotal > 21) {
                dealerWinCount++;
            } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
                playerWinCount++;
                totalPayout += bet * 2;
            } else if (dealerTotal > playerTotal) {
                dealerWinCount++;
            } else {
                totalPayout += bet;
            }
        });

        setPlayerWins(prev => prev + playerWinCount);
        setDealerWins(prev => prev + dealerWinCount);

        let result = {};
        if (playerWinCount > 0 && dealerWinCount > 0) {
            result = { message: 'Some hands won, some lost!', color: 0 };
        } else if (playerWinCount > 0) {
            result = { message: 'Player wins!', color: 1 };
        } else if (playerWinCount === 0 && dealerWinCount === 0) {
            result = { message: 'Push!', color: 0 };
        } else {
            result = { message: 'Dealer wins!', color: -1 };
        }

        setResultMessage(result);
        setGamePhase('gameOver');
        resolveBet(totalPayout);
    };

    const dealCards = async (initialBet) => {
        setGamePhase('dealing');
        let newShoe = [...shoe];
        if (shoe.length < 0.4 * 52 * numberOfDecks) {
            setResultMessage({ message: 'Reshuffling shoe...', color: 0 });
            await delay(duration);
            newShoe = createShoe(numberOfDecks);
            setRunningCount(0);
            setResultMessage({ message: '', color: 0 });
        }

        const playerCards = [];
        const newDealerHand = [];

        playerCards.push(newShoe.pop());
        updateCount([playerCards[0]]);
        setPlayerHands([{ cards: [...playerCards], bet: initialBet }]);
        // setPlayerMoney(prev => prev - initialBet);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        setDealerHand([...newDealerHand]);
        await delay(duration);

        playerCards.push(newShoe.pop());
        updateCount([playerCards[1]]);
        setPlayerHands([{ cards: [...playerCards], bet: initialBet }]);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        updateCount([newDealerHand[1]]);
        setDealerHand([...newDealerHand]);
        await delay(duration);

        setShoe(newShoe);

        if (!checkInitialBlackjack({ cards: playerCards, bet: initialBet }, newDealerHand)) {
            setGamePhase('playerTurn');
            setActiveHandIndex(0);
        }
    };

    const hit = (doubleDown = false) => {
        const newShoe = [...shoe];
        const card = newShoe.pop();
        updateCount([card]);
        const newHands = [...playerHands];
        newHands[activeHandIndex].cards.push(card);
        setPlayerHands(newHands);
        setShoe(newShoe);

        // does this work?
        if (doubleDown) {
            stand();
        }

        if (calculateHandValue(newHands[activeHandIndex].cards) > 21) {
            if (activeHandIndex < playerHands.length - 1) {
                setActiveHandIndex(activeHandIndex + 1);
            } else {
                stand();
            }
        }
    };

    const canDoubleDown = () => {
        return playerHands[activeHandIndex].cards.length == 2 && playerMoney >= playerHands[activeHandIndex].bet;
    };

    const doubleDown = () => {
        if (!canDoubleDown) return;
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
        setGamePhase('dealerTurn');
        showDealerCardUtil(true);
        let newShoe = [...shoe];
        let newDealerHand = [...dealerHand];

        while (calculateHandValue(newDealerHand) < 17) {
            await delay(1000);
            const card = newShoe.pop();
            newDealerHand.push(card);
            updateCount([card]);
            setDealerHand([...newDealerHand]);
        }
        setShoe(newShoe);
        evaluateHands(newDealerHand);
    };

    const canSplit = () => {
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
        showDealerCardUtil(false);
        setResultMessage({ message: '' });
        setActiveHandIndex(0)
    };

    return {
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
            doubleDown,
            handleSplit,
            resetHands
        },
        flags: {
            canSplit: canSplit(),
            canDoubleDown: canDoubleDown()
        },
        setters: {
            setCountCards,
            setShowBook
        }
    };
}
