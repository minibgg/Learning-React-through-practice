import { useEffect, useState } from "react";

const players = [
  { id: 1, name: "John", level: 25, winrate: 57 },
  { id: 2, name: "Ivan", level: 18, winrate: 49 },
  { id: 3, name: "Alex", level: 32, winrate: 63 },
  { id: 4, name: "Mike", level: 12, winrate: 54 },
  { id: 5, name: "Daniel", level: 27, winrate: 46 },
];

const foundPlayer = players.find((player) => player.id === 3);

const foundHighestLvlPlayer = players
  .filter((player) => player.level >= 30)
  .sort((a, b) => b.level - a.level)[0];

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
    </>
  );
}
