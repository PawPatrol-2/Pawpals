import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';
import { useUser } from '../../context/UserContext';

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        setMessage(data.message);

        if (res.ok && data.username) {
            setUser({ username: data.username });
            navigate('/');
        }
    };

    return (
        <div className="LoginPage">
            <h2>Logga in</h2>
            <p>Logga in på ditt konto</p>
            <form onSubmit={handleLogin}>
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
                    <label htmlFor="password">Lösenord:</label>
                    <div className="passwordField">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="passwordToggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div>
                    <button className='loginbutton' type="submit">Logga in</button>
                </div>
            </form>
            <div>{message}</div>
            <div>
                <Link to={'/registrera'}>Registrera dig</Link>
            </div>
        </div>
    )
}
