import { useState } from "react";

const players = [
  { id: 1, name: "John", level: 25, winrate: 57 },
  { id: 2, name: "Ivan", level: 18, winrate: 49 },
  { id: 3, name: "Alex", level: 32, winrate: 63 },
  { id: 4, name: "Mike", level: 12, winrate: 54 },
  { id: 5, name: "Daniel", level: 27, winrate: 46 },
];

function CheckLvl(props) {
  function handleClick() {
    console.log("Searching...");
    setTimeout(() => {
      const playerHighestLvl = props.players.sort(
        (a, b) => b.level - a.level,
      )[0];
      console.log(playerHighestLvl.level);
    }, 1000);
  }
  return <button onClick={handleClick}>Check level</button>;
}

function Counter(count, setCount) {
  function handleClick() {
    setCount((prevCount) => {
      console.log("Новое значение:", prevCount + 1); // Логируем актуальное новое значение
      return prevCount + 1;
    });
  }

  return <button onClick={handleClick}>+</button>;
}

export default function App() {
  const [users, setUsers] = useState(players);
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Счётчик: {count}</div>
      <Counter count={count} setCount={setCount} />
      <CheckLvl players={players} />
    </>
  );
}
