type Card = {
  suit: string;
  value: string;
};

type Deck = Card[];

type GameStates = "playing" | "user_won" | "dealer_won" | "tie";
