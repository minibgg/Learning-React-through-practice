import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  function FilterInput(props) {
    return (
      <>
        <input
          value={props.value}
          onChange={(e) => props.setInput(e.target.value)}
          placeholder={props.placeholder}
        />
      </>
    );
  }

  function User(props) {
    return <div>{props.user.name}</div>;
  }

  function UserList(props) {
    return (
      <>
        {props.users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </>
    );
  }

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

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
        placeholder="Search user"
      />
      <UserList users={filteredUsers}></UserList>
    </>
  );
}
