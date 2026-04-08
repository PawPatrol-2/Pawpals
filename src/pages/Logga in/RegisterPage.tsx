
import React, { useState } from 'react';
import './LoginPage.css';

export default function RegisterPage() {
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, username, password })
        })

        const data = await res.json();
        setMessage(data.message)

    }

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
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="username">Användarnamn:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Lösenord:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button className='loginbutton' type="submit">Registrera</button>
                </div>
            </form>
            <div>{message}</div>
        </div>
    );
}