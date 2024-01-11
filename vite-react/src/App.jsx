import React from "react";
import Dice from "./components/Dice";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice);
  const [tenzies, setTenzies] = React.useState(false);
  const { width, height } = useWindowSize();
  const [startTime, setStartTime] = React.useState(Date.now());
  const [currTime, setCurrTime] = React.useState();
  React.useEffect(() => {
    console.log("Dice state changed");
    let won = true;
    const value = dice[0].value;

    for (let i = 0; i < dice.length; i++) {
      if (value != dice[i].value || !dice[i].isHeld) {
        won = false;
        break;
      }
    }
    if (won) {
      setTenzies(true);
      const currentTime = Date.now() - startTime;

      if (!localStorage.getItem("bestTime")) {
        localStorage.setItem("bestTime", JSON.stringify(currentTime));
      } else if (JSON.parse(localStorage.getItem("bestTime")) > currentTime) {
        localStorage.setItem("bestTime", JSON.stringify(currentTime));
      }
      setCurrTime(currentTime);
    }
  }, [dice]);

  function logWinningTime(time, message) {
    let seconds = time / 1000;
    const minutes = Math.floor(seconds / 60);
    seconds = (seconds - minutes * 60).toFixed(2);
    return `${message} ${minutes} min ${seconds} sec`;
  }
  function allNewDice() {
    const randomNumbers = [];
    for (let i = 0; i < 10; i++) {
      randomNumbers.push({
        // value: Math.floor(Math.random() * 6) + 1,
        value: 6,
        isHeld: false,
        id: nanoid(),
      });
    }
    return randomNumbers;
  }

  function rollDice() {
    if (tenzies) {
      setStartTime(Date.now());
      setTenzies(false);
      setDice(allNewDice);
      return;
    }
    setDice((oldDice) => {
      return oldDice.map((d) => {
        if (!d.isHeld) {
          return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid(),
          };
        } else {
          return { value: d.value, isHeld: d.isHeld, id: d.id };
        }
      });
    });
  }
  function holdDice(id) {
    setDice((oldDice) => {
      return oldDice.map((d) => {
        if (d.id === id) {
          d.isHeld = !d.isHeld;
        }

        return d;
      });
    });
  }
  const diceElements = dice.map(({ value, isHeld, id }) => (
    <Dice
      value={value}
      id={id}
      key={id}
      isHeld={isHeld}
      holdDice={holdDice}
    ></Dice>
  ));
  return (
    <main>
      {tenzies && <Confetti width={width} height={height}></Confetti>}

      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-btn" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="time">
        <div className="best-time">
          {logWinningTime(
            JSON.parse(localStorage.getItem("bestTime")),
            "Best Time : "
          )}
        </div>
        {tenzies && (
          <div className="current-time">
            {logWinningTime(currTime, "You won in :")}
          </div>
        )}
      </div>
    </main>
  );
}
