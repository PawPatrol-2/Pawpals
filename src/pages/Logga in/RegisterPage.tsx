import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useUser } from "../../context/UserContext";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [role, setRole] = useState<"user" | "organization">("user");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, role }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.status === 201) {
      if (data.user.role === "organization") {
        setUser({ username: data.user.username, role: data.user.role });
        navigate("/organisation-dashboard");
        return;
      }

      setUser(null);
      navigate("/logga-in");
    }
  };

  return (
    <div className="LoginPage">
      <h2>Registrera</h2>
      <p>Skapa ett nytt konto</p>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">E-post:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Användarnamn:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Lösenord:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Roll:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "organization")}
          >
            <option value="user">Privatperson</option>
            <option value="organization">Organisation</option>
          </select>
        </div>
        <div>
          <button className="loginbutton" type="submit">
            Registrera
          </button>
        </div>
      </form>
      <div>{message}</div>
    </div>
  );
}
