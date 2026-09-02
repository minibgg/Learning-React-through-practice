import { useEffect, useReducer } from "react";
import { useCallback, useState, useMemo, memo } from "react";

interface User {
  id: number;
  name: string;
  level: number;
  winrate: number;
}

interface ResetAction {
  type: "SET_PLAYERS";
  payload: User[];
}

interface UserProps {
  user: User;
}

interface LvlUpButtonProps {
  lvlUp: (id: number) => void;
  user: User;
}

interface LevelUpAction {
  type: "LVL_UP";
  id: number;
}

type PlayerAction = ResetAction | LevelUpAction;

function HighestLevel(props: { HL: number }) {
  return <>Highest level: {props.HL}</>;
}

function ResetLevel(users: {
  initUsers: User[];
  dispatch: (action: ResetAction) => void;
}) {
  function resetLvl() {
    users.dispatch({ type: "SET_PLAYERS", payload: users.initUsers });
  }

  return <button onClick={() => resetLvl()}>RESET LEVELS</button>;
}

function AverageWinrate(props: { users: User[] }) {
  const totalWinrate = props.users.reduce((total, user) => {
    return total + user.winrate;
  }, 0);
  const averageWinrate = totalWinrate / props.users.length;

  return <>Average winrate: {averageWinrate}</>;
}

const User = memo(function User(props: UserProps) {
  return (
    <span>
      name: {props.user.name} | level: {props.user.level} | winrate:{" "}
      {props.user.winrate}
    </span>
  );
});

const LvlUpButton = memo(function LvlUpButton(props: LvlUpButtonProps) {
  console.log("lvlUpbutton render");
  return <button onClick={() => props.lvlUp(props.user.id)}>+</button>;
});

function UserList(props: { users: User[]; lvlUp: (id: number) => void }) {
  return props.users.map((user: User) => {
    return (
      <div key={user.id}>
        <User user={user} />
        <LvlUpButton user={user} lvlUp={props.lvlUp} />
      </div>
    );
  });
}

function FilterInput(props: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
}

function PlayerStats(props: { users: User[] }) {
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

function useFetch(url: string) {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
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
        const formatedUsers = data.map((user: User) => ({
          id: user.id,
          name: user.name,
          level: Math.floor(Math.random() * 30) + 1,
          winrate: Math.floor(Math.random() * 50) + 1,
        }));
        setData(formatedUsers);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") return;
          setError(error.message);
          console.log(error);
        }
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

function playerReducer(state: User[], action: PlayerAction) {
  switch (action.type) {
    case "SET_PLAYERS": {
      return action.payload;
    }
    case "LVL_UP": {
      return state.map((user) => {
        if (user.id === action.id) {
          return {
            ...user,
            level: user.level + 1,
          };
        }
        return user;
      });
    }
    default:
      return state;
  }
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
  const [users, dispatch] = useReducer(playerReducer, []);

  useEffect(() => {
    dispatch({ type: "SET_PLAYERS", payload: initUsers });
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

  const handleLvlUp = useCallback((id: number) => {
    dispatch({ type: "LVL_UP", id });
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
        <button
          onClick={() => {
            const controller = new AbortController();
            reFetch(controller.signal);
          }}
        >
          Попробовать ещё раз
        </button>
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
        <UserList lvlUp={handleLvlUp} users={filteredUsers} />
        <PlayerStats users={users} />
        <ResetLevel dispatch={dispatch} initUsers={initUsers} />
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
