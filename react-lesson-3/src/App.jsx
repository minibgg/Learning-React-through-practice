import { useEffect, useState } from "react";

const players = [
  { id: 1, name: "John", level: 25, winrate: 57 },
  { id: 2, name: "Ivan", level: 18, winrate: 49 },
  { id: 3, name: "Alex", level: 32, winrate: 63 },
  { id: 4, name: "Mike", level: 12, winrate: 54 },
  { id: 5, name: "Daniel", level: 27, winrate: 46 },
];

// const foundPlayer = players.find((player) => player.id === 3);

// const foundHighestLvlPlayer = players
//   .filter((player) => player.level >= 30)
//   .sort((a, b) => b.level - a.level)[0];

// const copyPlayers = structuredClone(players);
// copyPlayers.sort((a, b) => b.winrate - a.winrate)[0];

// const someHasWrUp60 = players.some((player) => player.winrate > 60);

// const allHasWrUp40 = players.every((player) => player.winrate > 40)

export default function App() {
  const [users, setUsers] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    setUsers(players);
  }, []);

  function FilterInput(props) {
    return (
      <input
        value={props.value}
        onChange={(e) => props.setInput(e.target.value)}
        placeholder={props.placeholder}
      />
    );
  }

  function ButtonLvlUp(props) {
    function lvlUp(id) {
      const newUsers = props.users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            level: user.level + 1,
          };
        }
        return user;
      });
      props.setUsers(newUsers);
    }
    return <button onClick={() => lvlUp(props.user.id)}>+</button>;
  }

  function User(props) {
    return (
      <div>
        name: {props.user.name} | level: {props.user.level} | winrate{" "}
        {props.user.winrate}
      </div>
    );
  }

  function UserList(props) {
    return props.users.map((user) => (
      <div key={user.id}>
        <User user={user} />
        <ButtonLvlUp
          user={user}
          users={props.allUsers}
          setUsers={props.setUsers}
        />
      </div>
    ));
  }

  function CheckWinrate(props) {
    function checkWinrate() {
      const WrUp60 = props.users.some((user) => user.winrate > props.wr);
      if (WrUp60 === true) {
        alert(`some player have winrate > ${props.wr}`);
      } else {
        alert(`no one dont have wr > ${props.wr}`);
      }
    }
    return <button onClick={checkWinrate}>check winrate</button>;
  }

  const filteredUsers = users.filter(function (user) {
    if (filterInput === "") {
      return true;
    }
    return user.name.toLowerCase().includes(filterInput.toLowerCase());
  });

  return (
    <>
      <FilterInput
        value={filterInput}
        setInput={setFilterInput}
        placeholder="Search Player"
      />
      <UserList
        users={filteredUsers}
        allUsers={users}
        setUsers={setUsers}
      ></UserList>
      <CheckWinrate wr={60} users={users} />
      <CheckWinrate wr={40} users={users} />
    </>
  );
}
