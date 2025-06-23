export function getCardCountValue(card) {
  const value = card.value;
  if (['2', '3', '4', '5', '6'].includes(value)) return 1;
  if (['10', 'J', 'Q', 'K', 'A'].includes(value)) return -1;
  return 0;
};

export function calculateHandValue(hand) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces += 1;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value, 10);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function getHandDisplay(hand) {
  let total = 0;
  let aces = 0;

  hand.forEach(card => {
    const value = card.value;
    if (['J', 'Q', 'K'].includes(value)) {
      total += 10;
    } else if (value === 'A') {
      total += 11;
      aces += 1;
    } else {
      total += parseInt(value);
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return aces > 0 ? `${total - 10}/${total}` : `${total}`;
}

export function calculateResultAmount(playerHands) {
  let amountWon = 0;
  playerHands.forEach(hand => {
    if (hand.status === 0) {
      // push
      amountWon += hand.bet
    } else if (hand.status === 1) {
      // win
      amountWon += hand.bet * 2;
    } else if (hand.status === 1.5) {
      // blackjack
      const bonus = hand.bet * 0.5;
      amountWon += (hand.bet * 2) + bonus;
    }
  });
  return amountWon;
}

export function calculateWinLoss(playerHands) {
  let total = 0;
   playerHands.forEach(hand => {
    switch (hand.status) {
      case 1:
        total += hand.bet;
        break;
      case 1.5:
        total += Math.floor(1.5 * hand.bet);
        break;
      case 0:
        // no gain or loss
        break;
      case -1:
      default:
        total -= hand.bet;
        break;
    }
  });

  return total;
}

export function getOutcomeType(hands) {
  const wins = hands.filter(h => h.status >= 1).length;
  const losses = hands.filter(h => h.status === -1).length;
  const pushes = hands.filter(h => h.status === 0).length;

  if (wins && !losses && !pushes) return 'win';
  if (losses && !wins && !pushes) return 'loss';
  if (pushes && !wins && !losses) return 'push';
  return 'mixed';
}