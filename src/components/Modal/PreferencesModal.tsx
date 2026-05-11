import { useState } from 'react';
import styles from './PreferencesModal.module.css';

interface PreferencesModalProps {
  onClose: () => void;
}

export default function PreferencesModal({ onClose }: PreferencesModalProps) {
  const [formData, setFormData] = useState({
    preferredAnimalType: '',
    preferredMaxAge: '',
    preferredPersonality: '',
    housingType: '',
    preferredChildFriendly: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('http://localhost:3000/api/users/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        preferredMaxAge: formData.preferredMaxAge ? Number(formData.preferredMaxAge) : undefined,
      }),
    });

    if (response.ok) {
      setSaved(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Mina preferenser</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Djurtyp
            <select
              value={formData.preferredAnimalType}
              onChange={(e) => setFormData({ ...formData, preferredAnimalType: e.target.value })}
            >
              <option value="">Spelar ingen roll</option>
              <option value="Hund">Hund</option>
              <option value="Katt">Katt</option>
              <option value="Fågel">Fågel</option>
              <option value="Kanin">Kanin</option>
            </select>
          </label>
          <label className={styles.label}>
            Max ålder på djuret
            <input
              type="number"
              value={formData.preferredMaxAge}
              onChange={(e) => setFormData({ ...formData, preferredMaxAge: e.target.value })}
              placeholder="T.ex. 5"
            />
          </label>
          <label className={styles.label}>
            Personlighet
            <select
              value={formData.preferredPersonality}
              onChange={(e) => setFormData({ ...formData, preferredPersonality: e.target.value })}
            >
              <option value="">Spelar ingen roll</option>
              <option value="Lugn">Lugn</option>
              <option value="Lekfull">Lekfull</option>
              <option value="Självständig">Självständig</option>
            </select>
          </label>
          <label className={styles.label}>
            Boendetyp
            <select
              value={formData.housingType}
              onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
            >
              <option value="">Välj boendetyp</option>
              <option value="lagenhet">Lägenhet</option>
              <option value="villa">Villa</option>
              <option value="radhus">Radhus</option>
            </select>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.preferredChildFriendly}
              onChange={(e) =>
                setFormData({ ...formData, preferredChildFriendly: e.target.checked })
              }
            />
            Djuret ska vara barnvänligt
          </label>
          {saved && <p className={styles.successMessage}>✅ Preferenser sparade!</p>}
          <div className={styles.buttons}>
            <button type="submit" className={styles.saveButton}>
              Spara
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
