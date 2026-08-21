import { useCallback, useState, useMemo, memo } from "react";

const players = [
  { id: 1, name: "John", level: 25, winrate: 57 },
  { id: 2, name: "Ivan", level: 18, winrate: 49 },
  { id: 3, name: "Alex", level: 32, winrate: 63 },
  { id: 4, name: "Mike", level: 12, winrate: 54 },
  { id: 5, name: "Daniel", level: 27, winrate: 46 },
];

function HighestLevel(props) {
  const copyPlayers = [...props.users];
  const highestPlayer = copyPlayers.sort((a, b) => b.level - a.level)[0];

  return <>Highest level: {highestPlayer.level}</>;
}

function ResetLevel(props) {
  function resetLvl() {
    props.setUsers(players);
  }

  return <button onClick={() => resetLvl()}>RESET LEVELS</button>;
}

function AverageWinrate(props) {
  const totalWinrate = props.users.reduce((total, user) => {
    return total + user.winrate;
  }, 0);
  const averageWinrate = totalWinrate / props.users.length;

  return <>Average winrate: {averageWinrate}</>;
}

const User = memo(function User(props) {
  return (
    <span>
      {console.log("User render")}
      name: {props.user.name} | level: {props.user.level} | winrate:{" "}
      {props.user.winrate}
    </span>
  );
});

const LvlUpButton = memo(function LvlUpButton(props) {
  console.log("lvlUpbutton render");
  return <button onClick={() => props.lvlUp(props.user.id)}>+</button>;
});

function UserList(props) {
  return props.users.map((user) => {
    return (
      <div key={user.id}>
        <User user={user} />
        <LvlUpButton user={user} lvlUp={props.lvlUp} />
      </div>
    );
  });
}

function FilterInput(props) {
  return (
    <input
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
}

function PlayerStats(props) {
  return <>сейчас {props.users.length} игроков</>;
}

export default function App() {
  const [users, setUsers] = useState(players);
  const [filterInput, setFilterInput] = useState("");

  const handleLvlUp = useCallback((id) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            level: user.level + 1,
          };
        }

        return user;
      });
    });
  }, []);
  const filteredUsers = useMemo(() => {
    return users.filter(function (user) {
      if (filterInput === "") {
        return true;
      } else {
        return user.name.toLowerCase().includes(filterInput.toLowerCase());
      }
    });
  }, [users, filterInput]);

  return (
    <>
      <FilterInput
        value={filterInput}
        onChange={setFilterInput}
        placeholder="Search for name"
      />
      <UserList lvlUp={handleLvlUp} setUsers={setUsers} users={filteredUsers} />
      <PlayerStats users={users} />
      <ResetLevel setUsers={setUsers} />
      <AverageWinrate users={users} />
      <br />
      <HighestLevel users={users} />
    </>
  );
}
