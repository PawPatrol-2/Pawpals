import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './LoginPage.css'
import { useUser } from '../../context/UserContext';



export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { setUser } = useUser()

    const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password})
        })
        const data = await res.json()
        setMessage(data.message)
    
        if(res.status === 200) {
            setUser({ username });
        }
    }

    

    return (
        <div className="LoginPage">
            <h2>Logga in</h2>
            <p>Logga in på ditt konto</p>
            <form onSubmit={handleLogin}>

            <div>
                <label htmlFor="username">Användarnamn:</label>
                <input 
                id="username" 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Lösenord:</label>
                <input 
                id="password" 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)} />
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