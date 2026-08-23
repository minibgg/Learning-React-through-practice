import { useEffect } from "react";
import { useCallback, useState, useMemo, memo } from "react";

const players = [
  { id: 1, name: "John", level: 25, winrate: 57 },
  { id: 2, name: "Ivan", level: 18, winrate: 49 },
  { id: 3, name: "Alex", level: 32, winrate: 63 },
  { id: 4, name: "Mike", level: 12, winrate: 54 },
  { id: 5, name: "Daniel", level: 27, winrate: 46 },
];

function HighestLevel(props) {
  return <>Highest level: {props.HL}</>;
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

function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>Время сессии: {seconds} сек.</>;
}

export default function App() {
  const [showTimer, setShowTimer] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [filterInput, setFilterInput] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  function fetchPlayer() {
    setIsLoading(true);
    setError(null);
    const randomNum100 = Math.random() * 101;
    console.log(randomNum100.toFixed(0));
    setTimeout(() => {
      if (randomNum100.toFixed(0) <= 50) {
        setIsLoading(false);
        setUsers(() => {
          const saved = localStorage.getItem("saved_players");

          if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) {
              return parsed;
            }
          }
          return players;
        });
      } else {
        setIsLoading(false);
        setError("Ошибка парсинга игроков");
      }
    }, 2000);
  }

  useEffect(() => {
    fetchPlayer();
  }, []);

  const highestLevel =
    [...users].sort((a, b) => b.level - a.level)[0]?.level || 0;

  useEffect(() => {
    if (isLoading === false) {
      localStorage.setItem("saved_players", JSON.stringify(users));
    }
  }, [users, isLoading]);
  useEffect(() => {
    document.title = `Игроков:${users.length} | Макс. уровень:${highestLevel}`;
  }, [users.length, highestLevel]);

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

  if (isLoading === true) {
    return <div>Загрузка игроков</div>;
  } else if (error !== null) {
    return (
      <>
        <div>Ошибка загрузки игроков</div>
        <button onClick={fetchPlayer}>Попробовать ещё раз</button>
      </>
    );
  } else {
    return (
      <>
        <FilterInput
          value={filterInput}
          onChange={setFilterInput}
          placeholder="Search for name"
        />
        <UserList
          lvlUp={handleLvlUp}
          setUsers={setUsers}
          users={filteredUsers}
        />
        <PlayerStats users={users} />
        <ResetLevel setUsers={setUsers} />
        <AverageWinrate users={users} />
        <br />
        <HighestLevel HL={highestLevel} />
        <br />
        {showTimer && <SessionTimer />}
        <button onClick={() => setShowTimer((prev) => !prev)}>
          Переключить таймер
        </button>
      </>
    );
  }
}
