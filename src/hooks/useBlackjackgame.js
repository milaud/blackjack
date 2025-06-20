import { useState } from 'react';
import { createShoe } from '../components/Shoe/Shoe';
import { calculateHandValue } from '../utils/gameLogic';
import { getCardCountValue } from '../utils/helpers';

export default function useBlackjackGame(numberOfDecks) {
    const [shoe, setShoe] = useState(createShoe(numberOfDecks));
    const [playerHands, setPlayerHands] = useState([[]]);
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
    // const duration = 0;

    const updateCount = (cards) => {
        let delta = 0;
        cards.forEach(card => {
            delta += getCardCountValue(card);
        });
        setRunningCount(prev => prev + delta);
    };

    const showDealerCardUtil = (show, dealerCard=null) => {
        setShowDealerCard(show)
        if (show) {
            if (!dealerCard) {
                dealerCard = dealerHand[0]
            }
            updateCount([dealerCard]);
        }
    }

    const checkInitialBlackjack = (newPlayerHand, newDealerHand) => {
        const playerTotal = calculateHandValue(newPlayerHand);
        const dealerTotal = calculateHandValue(newDealerHand);
        let result = {};

        if (playerTotal === 21 || dealerTotal === 21) {
            showDealerCardUtil(true, newDealerHand[0]);
            if (playerTotal === 21 && dealerTotal === 21) {
                result = { message: 'Push! Both have Blackjack.', color: 0 };
            } else if (playerTotal === 21) {
                result = { message: 'Blackjack! Player wins!', color: 1 };
                setPlayerWins(prev => prev + 1);
            } else {
                result = { message: 'Dealer has Blackjack!', color: -1 };
                setDealerWins(prev => prev + 1);
            }
            setResultMessage(result);
            setGamePhase('gameOver');
            return true;
        }
        return false;
    };

    const evaluateHands = (finalDealerHand) => {
        const dealerTotal = calculateHandValue(finalDealerHand);
        let playerWinCount = 0;
        let dealerWinCount = 0;

        playerHands.forEach(hand => {
            const playerTotal = calculateHandValue(hand);
            if (playerTotal > 21) dealerWinCount++;
            else if (dealerTotal > 21 || playerTotal > dealerTotal) playerWinCount++;
            else if (dealerTotal > playerTotal) dealerWinCount++;
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
    };

    const dealCards = async () => {
        setGamePhase('dealing')
        let newShoe = [...shoe];
        if (shoe.length < 0.4 * 52 * numberOfDecks) {
            setResultMessage({"message": "Reshuffling shoe...", "color": 0});
            await delay(duration)
            newShoe = createShoe(numberOfDecks);
            setRunningCount(0);
            setResultMessage({"message": "", "color": 0});
        }
        const newPlayerHand = [];
        const newDealerHand = [];

        newPlayerHand.push(newShoe.pop());
        updateCount([newPlayerHand[0]]);
        setPlayerHands([[...newPlayerHand]]);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        // updateCount([newDealerHand[0]]);
        setDealerHand([...newDealerHand]);
        await delay(duration);

        newPlayerHand.push(newShoe.pop());
        updateCount([newPlayerHand[1]]);
        setPlayerHands([[...newPlayerHand]]);
        await delay(duration);

        newDealerHand.push(newShoe.pop());
        updateCount([newDealerHand[1]]);
        setDealerHand([...newDealerHand]);
        await delay(duration);
        
        setShoe(newShoe);

        if (!checkInitialBlackjack(newPlayerHand, newDealerHand)) {
            setGamePhase('playerTurn');
            setActiveHandIndex(0);
        }
    }

    const hit = () => {
        const newShoe = [...shoe];
        const card = newShoe.pop();
        updateCount([card]);
        const newHands = [...playerHands];
        newHands[activeHandIndex].push(card);
        setPlayerHands(newHands);
        setShoe(newShoe);

        if (calculateHandValue(newHands[activeHandIndex]) > 21) {
            if (activeHandIndex < playerHands.length - 1) {
                setActiveHandIndex(activeHandIndex + 1);
            } else {
                stand();
            }
        }
    };

    const stand = async () => {
        if (activeHandIndex < playerHands.length - 1) {
            setActiveHandIndex(activeHandIndex + 1);
            return;
        }
        setGamePhase('dealerTurn');
        showDealerCardUtil(true)
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
        // TO LOOK INTO: split on same card values or actual cards? 
        // ie can we split on K, 10?
        const hand = playerHands[activeHandIndex];
        return hand.length === 2 && hand[0].value === hand[1].value;
    };

    const handleSplit = () => {
        if (!canSplit()) return;
        const newShoe = [...shoe];
        const hands = [...playerHands];
        const currentHand = hands[activeHandIndex];

        const hand1 = [currentHand[0], newShoe.pop()];
        const hand2 = [currentHand[1], newShoe.pop()];

        updateCount([hand1[1], hand2[1]]);

        hands.splice(activeHandIndex, 1, hand1, hand2);
        setPlayerHands(hands);
        setShoe(newShoe);
    };

    const resetHands = () => {
        setPlayerHands([[]]);
        setDealerHand([]);
        showDealerCardUtil(false)
        setResultMessage({"message": ""});
    };

    /*
      TODO: 
        add options to place bets
            - enter amount to start with at the very beginning
            - enter minimum bets

        add double down buttons/logic
    */

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
            handleSplit,
            resetHands
        },
        flags: {
            canSplit: canSplit()
        },
        setters: {
            setCountCards,
            setShowBook
        }
    };

}
