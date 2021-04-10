export function getCardValue(cardValue: string): number {
  if (cardValue === "A") {
    return 1;
  }

  if (cardValue === "K") {
    return 13;
  }

  if (cardValue === "Q") {
    return 12;
  }

  if (cardValue === "J") {
    return 11;
  }

  return parseInt(cardValue);
}

export function getDeckTotal(deck: Deck): number {
  const aces = [];

  for (const card of deck) {
    if (card.value === "A") {
      aces.push(card);
    }
  }

  const remainingDeck = deck.filter((card) => card.value !== "A");

  let value = 0;

  value = remainingDeck.reduce(
    (acc, currentCard) => acc + getCardValue(currentCard.value),
    0
  );

  for (const ace of aces) {
    if (value + 11 > 21) {
      value = value + 1;
    } else {
      value = value + 11;
    }
  }

  return value;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getShuffledDeck(): Deck {
  const suits = ["S", "D", "C", "H"];
  const cards = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const deck: Deck = suits
    .map((suit) =>
      cards.map((value) => ({
        suit,
        value,
      }))
    )
    .flat();
  return shuffle(deck);
}

// This function is from SO, with some of my TS sprinkled on top
export function shuffle<T>(array: Array<T>): Array<T> {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex = -1;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
