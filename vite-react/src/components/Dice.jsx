import React from "react";

export default function Dice(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };
  return (
    <div
      className="dice"
      style={styles}
      onClick={() => props.holdDice(props.id)}
    >
      {props.value}
    </div>
  );
}
