export function getCardCountValue(card) {
    const value = card.value;
    if (['2', '3', '4', '5', '6'].includes(value)) return 1;
    if (['10', 'J', 'Q', 'K', 'A'].includes(value)) return -1;
    return 0;
};
