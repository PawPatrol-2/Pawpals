import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import styles from './RegisterForm.module.css';

const RegisterForm: React.FC = () => {
  const [accountType, setAccountType] = useState<'adopter' | 'organization'>('adopter');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    consent: false,
  });

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let url = '';
      let payload: { email: string; password: string; username?: string; organization?: string } = { email: '', password: '' };

      if (accountType === 'organization') {
        url = '/api/organisations/register';
        payload = {
          email: formData.email,
          organization: formData.name,
          password: formData.password
        };
      } else {
        url = '/api/users/register';
        payload = {
          email: formData.email,
          username: formData.name,
          password: formData.password
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

        if (response.ok) {
          navigate('/logga-in');
      } else {
        console.error('Registrering misslyckades', await response.json());
      }
    } catch (error) {
      console.error('Ett fel inträffade', error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Skapa konto</h1>
      <p>Välj vilken typ av konto du vill skapa</p>
      <div className={styles.accountTypeContainer}>
        <button
          type="button"
          className={accountType === 'adopter' ? styles.active : ''}
          onClick={() => setAccountType('adopter')}
        >
          <span role="img" aria-label="paw">🐾</span> Adoptör
          <br /> Jag vill adoptera
        </button>
        <button
          type="button"
          className={accountType === 'organization' ? styles.active : ''}
          onClick={() => setAccountType('organization')}
        >
          <span role="img" aria-label="building">🏢</span> Organisation
          <br />
        </button>
      </div>
      <label>
        Namn
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ditt namn"
          required
        />
      </label>
      <label>
        E-post
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="din@email.se"
          required
        />
      </label>
      <label>
        Lösenord
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Lösenord"
          required
        />
      </label>
      <label className={styles.consentCheckbox}>
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleInputChange}
          required
        />
        Jag samtycker till behandling av mina personuppgifter (GDPR)
      </label>
      <button type="submit" className={styles.submitButton}>
        Skapa konto
      </button>
    </form>
  );
};

export default RegisterForm;