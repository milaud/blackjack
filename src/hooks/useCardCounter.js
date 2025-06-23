import { useState } from 'react';
import { getCardCountValue } from '../utils/helpers';

export default function useCardCounter() {
    const [countCards, setCountCards] = useState(false);
    const [runningCount, setRunningCount] = useState(0);

    const updateCount = (cards) => {
        let delta = 0;
        cards.forEach(card => {
            delta += getCardCountValue(card);
        });
        setRunningCount(prev => prev + delta);
    };

    return {
        countCards,
        runningCount,
        setCountCards,
        setRunningCount,
        updateCount
    }
}