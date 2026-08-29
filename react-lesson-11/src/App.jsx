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

function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (signal) => {
      setError(null);
      setIsLoading(true);
      if (!url) {
        console.error("url is incorect");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          throw new Error("Ошибка запроса");
        }
        const data = await res.json();
        const formatedUsers = data.map((user) => ({
          id: user.id,
          name: user.name,
          level: Math.floor(Math.random() * 30) + 1,
          winrate: Math.floor(Math.random() * 50) + 1,
        }));
        setData(formatedUsers);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError(error.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [url, fetchData]);
  return { data, isLoading, error, reFetch: fetchData };
}

export default function App() {
  const {
    data: initUsers,
    isLoading,
    error,
    reFetch,
  } = useFetch("https://jsonplaceholder.typicode.com/users");
  const [showTimer, setShowTimer] = useState(true);
  const [filterInput, setFilterInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(initUsers);
  }, [initUsers]);

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
        <button onClick={reFetch}>Попробовать ещё раз</button>
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
