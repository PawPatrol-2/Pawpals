import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './RegisterPage.css';

type AccountType = 'adopter' | 'organization';

export default function RegisterPage() {
    const [accountType, setAccountType] = useState<AccountType>('adopter');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [gdprConsent, setGdprConsent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!gdprConsent) {
            setIsSuccess(false);
            setMessage('Du behöver godkänna GDPR för att skapa konto.');
            return;
        }

        try {
            setIsSubmitting(true);
            let url = '';
            let payload: any = {};
            if (accountType === 'organization') {
                url = 'http://localhost:3000/api/organisations/register';
                payload = { email, organization: username, password };
            } else {
                url = 'http://localhost:3000/api/users/register';
                payload = { email, username, password };
            }
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            setIsSuccess(res.ok);
            setMessage(data.message);

            if (res.ok) {
                setPassword('');
            }
        } catch {
            setIsSuccess(false);
            setMessage('Något gick fel. Försök igen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="registerPage">
            <section className="registerCard">
                <h1>Skapa konto</h1>
                <p className="registerSubtitle">Välj vilken typ av konto du vill skapa</p>

                <div className="accountTypeGrid" role="radiogroup" aria-label="Kontotyp">
                    <button
                        type="button"
                        className={`accountTypeCard ${accountType === 'adopter' ? 'active' : ''}`}
                        onClick={() => setAccountType('adopter')}
                        aria-pressed={accountType === 'adopter'}
                    >
                        <span className="icon" aria-hidden="true">🐾</span>
                        <span className="cardTitle">Adoptör</span>
                        <span className="cardSubtitle">Jag vill adoptera</span>
                    </button>
                    <button
                        type="button"
                        className={`accountTypeCard ${accountType === 'organization' ? 'active' : ''}`}
                        onClick={() => setAccountType('organization')}
                        aria-pressed={accountType === 'organization'}
                    >
                        <span className="icon" aria-hidden="true">🏢</span>
                        <span className="cardTitle">Organisation</span>
                        <span className="cardSubtitle">Vi listar djur</span>
                    </button>
                </div>

                <form onSubmit={handleRegister} className="registerForm">
                    <label htmlFor="username">Namn</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Ditt namn"
                        required
                    />

                    <label htmlFor="email">E-post</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="din@email.se"
                        required
                    />

                    <label htmlFor="password">Lösenord</label>
                    <div className="registerPasswordField">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="registerPasswordToggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <label className="gdprBox" htmlFor="gdprConsent">
                        <input
                            id="gdprConsent"
                            type="checkbox"
                            checked={gdprConsent}
                            onChange={(e) => setGdprConsent(e.target.checked)}
                        />
                        <span>Jag samtycker till behandling av mina personuppgifter (GDPR)</span>
                    </label>

                    <button className='registerButton' type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Skapar konto...' : 'Skapa konto'}
                    </button>
                </form>

                {message && (
                    <p className={`registerMessage ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}

                <p className="loginHint">
                    Har du redan konto? <Link to="/logga-in">Logga in</Link>
                </p>
            </section>
        </main>
    );
}
=======
import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <div>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
>>>>>>> Stashed changes
