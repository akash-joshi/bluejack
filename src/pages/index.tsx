import { Button } from "antd";
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  VariantLabels,
} from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  getDeckTotal,
  getShuffledDeck,
  sleep,
} from "../components/utils/functions";

// Whether to display or hide the underlying variables
const DEBUG = false;

export default function Home() {
  // All of the state variables for the game
  const [remainingDeck, setRemainingDeck] = useState<Deck>(getShuffledDeck());
  const [userCards, setUserCards] = useState<Deck>([]);
  const [dealerCards, setDealerCards] = useState<Deck>([]);
  const [gameState, setGameState] = useState<GameStates>("playing");
  const [whoseTurn, setWhoseTurn] = useState<"user" | "dealer">("user");

  // Reset all variables to initial state
  const reset = () => {
    setRemainingDeck(getShuffledDeck());
    setUserCards([]);
    setDealerCards([]);
    setGameState("playing");
    setWhoseTurn("user");
  };

  // The user's and dealer's scores
  const userTotal = getDeckTotal(userCards);
  const dealerTotal = getDeckTotal(dealerCards);

  useEffect(() => {
    // Win condition for dealer
    if (userTotal > 21) {
      setGameState("dealer_won");
    }

    // Win condition for user
    if (dealerTotal > 21) {
      setGameState("user_won");
    }

    // Set initial cards for user and dealer
    if (userTotal === 0 && dealerTotal === 0) {

      // I use spread operator everywhere because .pop() is a mutating function
      const intermediateDeck = [...remainingDeck];

      const firstUserCards = [intermediateDeck.pop(), intermediateDeck.pop()];

      setUserCards(firstUserCards);

      const firstDealerCard = intermediateDeck.pop();

      setDealerCards([firstDealerCard]);

      setRemainingDeck(intermediateDeck);
    }
  }, [userTotal, dealerTotal]);

  // Not a fan of this useEffect, I basically wanted to call the dealersTurn function till the dealer's turn is over.
  useEffect(() => {
    if (whoseTurn === "dealer" && dealerTotal < 17) {
      dealersTurn();
    } else {
      setWhoseTurn("user");
    }
  }, [whoseTurn, dealerTotal]);

  const hitUser = () => {
    const intermediateDeck = [...remainingDeck];

    const hitUserCard = intermediateDeck.pop();

    setUserCards([...userCards, hitUserCard]);

    setRemainingDeck(intermediateDeck);
  };

  const dealersTurn = async () => {
    await sleep(500);

    const intermediateDeck = [...remainingDeck];

    const hitDealerCard = intermediateDeck.pop();

    setRemainingDeck(intermediateDeck);

    const nextDealerCards = [...dealerCards, hitDealerCard];
    const nextDealerTotal = getDeckTotal(nextDealerCards);

    // after dealer turn ends, and before next steps, find out the winner of the game
    if (nextDealerTotal >= 17) {
      if (nextDealerTotal > 21 || userTotal > nextDealerTotal) {
        setGameState("user_won");
      }

      if (nextDealerTotal > userTotal) {
        setGameState("dealer_won");
      }

      if (userTotal === nextDealerTotal) {
        setGameState("tie");
      }
    }

    setDealerCards([...dealerCards, hitDealerCard]);
  };

  const exitAnimation: VariantLabels | TargetAndTransition = {
    x: 500,
    opacity: 0,
    transition: {
      // this is supposed to remove the spring effect on exit animation but in some cases it still doesn't work
      // edit, a duration of 0.5 secs fixes it, but any lesser brings spring back
      staggerChildren: 0.1,
      type: "tween",
      duration: 0.5,
    },
  };

  return (
    <div>
      <Head>
        <title>Bluejack</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={{ textAlign: "center", color: "#1890ff" }}>
          <h1 style={{ color: "#1890ff" }}>BlueJack</h1>
          <h2 style={{ color: "#1890ff" }}>
            The game to play while you have the Blues ;)
          </h2>
        </div>
        {DEBUG && (
          <>
            {" "}
            {remainingDeck.length}: {JSON.stringify(remainingDeck)}
            <br />
            <br />
          </>
        )}
        User Deck: {DEBUG && JSON.stringify(userCards)}
        <br />
        <AnimatePresence>
          {userCards.map((userCard, index) => (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={exitAnimation}
              key={index}
              alt={`card ${userCard.value}${userCard.suit}`}
              src={`/cards/${userCard.value}${userCard.suit}.svg`}
              style={{ marginRight: "1em", height: 200, marginTop: "1em" }}
            />
          ))}
        </AnimatePresence>
        <br />
        User Total: {userTotal}
        <br />
        <br />
        Dealer Deck: {DEBUG && JSON.stringify(dealerCards)}
        <br />
        <AnimatePresence>
          {dealerCards.map((dealerCard, index) => (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={exitAnimation}
              key={index}
              alt={`card ${dealerCard.value}${dealerCard.suit}`}
              src={`/cards/${dealerCard.value}${dealerCard.suit}.svg`}
              style={{ marginRight: "1em", height: 200, marginTop: "1em" }}
            />
          ))}
        </AnimatePresence>
        <br />
        Dealer Total: {dealerTotal}
        <br />
        <br />
        {gameState === "playing" && (
          <>
            <Button
              disabled={whoseTurn !== "user"}
              style={{ marginRight: "1em" }}
              onClick={() => hitUser()}
            >
              Hit
            </Button>{" "}
            <Button
              disabled={whoseTurn !== "user"}
              style={{ marginRight: "1em" }}
              onClick={() => setWhoseTurn("dealer")}
            >
              Stick
            </Button>
          </>
        )}
        {gameState === "dealer_won" && (
          <div>
            Dealer Wins! <br />
            <br /> <Button onClick={() => reset()}>Restart</Button>
          </div>
        )}
        {gameState === "user_won" && (
          <div>
            User Wins! <br />
            <br /> <Button onClick={() => reset()}>Restart</Button>
          </div>
        )}
        {gameState === "tie" && (
          <div>
            It's a tie! <br />
            <br /> <Button onClick={() => reset()}>Restart</Button>
          </div>
        )}
      </main>
    </div>
  );
}
