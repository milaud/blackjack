export const basicStrategyTable = {
    // Rows: Player's hand total or soft/hard notation
    // Columns: Dealer's up card value (2 to A)
    // Values: suggested action (H=Hit, S=Stand, D=Double if allowed else Hit, P=Split)

    // Example hard totals
    hard: {
        8: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
        9: ['D', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
        10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
        11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
        12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
        13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
        14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
        15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
        16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
        17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    },

    // Soft totals (A + another card)
    soft: {
        13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,2
        14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,3
        15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,4
        16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,5
        17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,6
        18: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'], // A,7
        19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,8
    },

    // Pairs
    pairs: {
        2: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // Pair of 2s
        3: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // Pair of 3s
        4: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // Pair of 4s
        5: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'], // Pair of 5s (treat as 10)
        6: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // Pair of 6s
        7: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'S', 'H'], // Pair of 7s
        8: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Pair of 8s
        9: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'], // Pair of 9s
        10: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // Pair of 10s
        11: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Pair of Aces
    }
};

export function getStrategyTableRows() {
  return basicStrategyTable.map((entry, idx) => ({
    id: idx,
    playerTotal: entry.playerTotal,
    dealerCard: Array.isArray(entry.dealerCard) ? entry.dealerCard.join(', ') : entry.dealerCard,
    action: entry.action,
  }));
}

const dealerValueIndex = (dealerCardValue) => {
    // Map dealer card to index 0-9 for table lookup (2-10, J,Q,K,A)
    if (dealerCardValue === 'A') return 9;
    if (['J', 'Q', 'K'].includes(dealerCardValue)) return 8;
    return parseInt(dealerCardValue) - 2;
}

export function getBlackjackStrategy(dealerCard, playerCards) {
    if (!dealerCard || !playerCards.length) return 'No data to give advice';

    const dealerIndex = dealerValueIndex(dealerCard.value);
    const handValues = playerCards.map(c => c.value);

    // Check if pair
    if (playerCards.length === 2 && handValues[0] === handValues[1]) {
        const val = handValues[0] === 'A' ? 11 : parseInt(handValues[0]) || (handValues[0] === 'A' ? 11 : 0);
        const pairRow = basicStrategyTable.pairs[val];
        if (pairRow) {
            return `Basic strategy suggests: ${actionName(pairRow[dealerIndex])} for pair of ${handValues[0]}s.`;
        }
    }

    // Check if soft hand (has Ace counted as 11)
    const containsAce = handValues.includes('A');
    const handTotal = playerCards.reduce((sum, c) => sum + cardValue(c), 0);
    if (containsAce && handTotal <= 21) {
        // Soft total
        const softRow = basicStrategyTable.soft[handTotal];
        if (softRow) {
            return `Basic strategy suggests: ${actionName(softRow[dealerIndex])} for soft ${handTotal}.`;
        }
    }

    // Hard total fallback
    const hardTotal = calculateHardTotal(playerCards);
    const hardRow = basicStrategyTable.hard[hardTotal];
    if (hardRow) {
        return `Basic strategy suggests: ${actionName(hardRow[dealerIndex])} for hard ${hardTotal}.`;
    }

    return "No strategy found for this hand.";
}

function actionName(letter) {
    switch (letter) {
        case 'H': return 'Hit';
        case 'S': return 'Stand';
        case 'D': return 'Double Down if allowed, else Hit';
        case 'P': return 'Split';
        default: return 'Unknown action';
    }
}

function cardValue(card) {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value) || 0;
}

function calculateHardTotal(cards) {
    // Count Ace as 1 in hard total
    let total = 0;
    cards.forEach(c => {
        if (c.value === 'A') total += 1;
        else if (['J', 'Q', 'K'].includes(c.value)) total += 10;
        else total += parseInt(c.value) || 0;
    });
    return total;
}
