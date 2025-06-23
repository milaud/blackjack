import { calculateHandValue } from "./helpers";

export function checkInitialBlackjack(playerHandObj, dealerHand) {
    const playerTotal = calculateHandValue(playerHandObj.cards);
    const dealerTotal = calculateHandValue(dealerHand);

    let result = null;
    let status = null;

    if (playerTotal === 21 || dealerTotal === 21) {
        if (playerTotal === 21 && dealerTotal === 21) {
            result = { message: 'Push! Both have Blackjack.', color: 0 };
            status = 0;
        } else if (playerTotal === 21) {
            result = { message: 'Blackjack! Player wins!', color: 1 };
            status = 1.5;
        } else {
            result = { message: 'Dealer has Blackjack!', color: -1 };
            status = -1;
        }

        return {
            blackjack: true,
            updatedHand: { ...playerHandObj, status },
            result
        };
    }

    return {
        blackjack: false
    };
}

export function evaluateHands(playerHands, dealerHand) {
    const dealerTotal = calculateHandValue(dealerHand);
    let playerWinCount = 0;
    let dealerWinCount = 0;

    const updatedHands = playerHands.map(hand => {
        const total = calculateHandValue(hand.cards);
        let status;
        if (total > 21) {
            status = -1;
            dealerWinCount++;
        } else if (dealerTotal > 21 || total > dealerTotal) {
            status = 1;
            playerWinCount++;
        } else if (dealerTotal > total) {
            status = -1;
            dealerWinCount++;
        } else {
            status = 0;
        }

        return { ...hand, status };
    });

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

    return {
        updatedHands,
        playerWinCount,
        dealerWinCount,
        result
    };
}
