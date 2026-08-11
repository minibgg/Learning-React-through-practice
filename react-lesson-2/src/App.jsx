import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [filterInput, setFilterInput] = useState("");
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
      <input
        value={filterInput}
        placeholder="Filter by name"
        onChange={(e) => setFilterInput(e.target.value)}
      />
      <div>
        {filteredUsers.map((filteredUser) => (
          <div key={filteredUser.id}>{filteredUser.name}</div>
        ))}
      </div>
    </>
  );
}
