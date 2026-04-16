import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';
import { useUser } from '../../context/UserContext';

type AccountType = 'adopter' | 'organization';

export default function LoginPage() {
    const [accountType, setAccountType] = useState<AccountType>('adopter');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginEndpoint = accountType === 'organization'
            ? 'http://localhost:3000/api/organisations/login'
            : 'http://localhost:3000/api/users/login';

        const res = await fetch(loginEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        setMessage(data.message);

        if (res.ok && data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('accountType', accountType);
            setUser({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email
            });
            navigate('/');
        }
    };

    return (
        <div className="LoginPage">
            <h2>Logga in</h2>
            <p>Logga in på ditt konto</p>
            <form className="loginForm" onSubmit={handleLogin}>
                <div className="accountTypeGroup">
                    <button
                        type="button"
                        className={`accountTypeButton ${accountType === 'adopter' ? 'active' : ''}`}
                        onClick={() => setAccountType('adopter')}
                    >
                        <span className="accountTypeTitle">Adoptör</span>
                        <span className="accountTypeSub">Jag vill adoptera</span>
                    </button>
                    <button
                        type="button"
                        className={`accountTypeButton ${accountType === 'organization' ? 'active' : ''}`}
                        onClick={() => setAccountType('organization')}
                    >
                        <span className="accountTypeTitle">Organisation</span>
                        <span className="accountTypeSub">Vi listar djur</span>
                    </button>
                </div>
                <div className="loginField">
                    <label htmlFor="email">E-post:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="loginField">
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
                <div className="loginField">
                    <button className='loginbutton' type="submit">Logga in</button>
                </div>
            </form>
            <div className="loginMessage">{message}</div>
            <div className="loginFooter">
                <Link to={'/registrera'}>Registrera dig</Link>
            </div>
        </div>
    )
}
