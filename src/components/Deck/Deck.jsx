// const cards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const cards = ['2','2', '2', '2', '2', '2', '2'];

const suits = ['♤','♢','♡','♧'];

export function createDeck() {
  const deck = [];
  suits.forEach(suit => cards.forEach(value => deck.push({ value, suit })));
  return deck;
}

export function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}