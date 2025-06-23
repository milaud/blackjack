import { createDeck, shuffleDeck } from '../Deck/Deck';

export function createShoe(numDecks = 6) {
  let shoe = [];
  for (let i = 0; i < numDecks; i++) {
    shoe = shoe.concat(createDeck());
  }
  shuffleDeck(shoe);
  return shoe;
}
