import { useState } from 'react';
import { calculateResultAmount } from '../utils/helpers';

export default function useBetting(initialMoney = 1000) {
  const [playerMoney, setPlayerMoney] = useState(initialMoney);
  const [playerBet, setPlayerBet] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);

  const canAfford = (amount) => playerMoney >= amount;

  const placeBet = (amount) => {
    if (canAfford(amount)) {
      setPlayerMoney((prev) => prev - amount);
      setPlayerBet((prev) => prev + amount);
      return true;
    }
    return false;
  };

  const reduceBet = (amount) => {
    if (playerBet >= amount) {
      setPlayerBet((prev) => prev - amount);
      setPlayerMoney((prev) => prev + amount);
      return true;
    }
    return false;
  };

  const clearBet = () => {
    setPlayerMoney((prev) => prev + playerBet);
    setPlayerBet(0);
  };

  const resolveBet = (playerHands) => {
    const amountWon = calculateResultAmount(playerHands)
    setPlayerMoney((prev) => prev + amountWon);
    setPlayerBet(0);
    setBetPlaced(false);
  };

  return {
    playerMoney,
    playerBet,
    betPlaced,
    setBetPlaced,
    canAfford,
    placeBet,
    reduceBet,
    clearBet,
    resolveBet,
    setPlayerBet,
    setPlayerMoney
  };
}
