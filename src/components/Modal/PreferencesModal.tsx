import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './PreferencesModal.module.css';
import { notifyUserPreferencesUpdated } from '../../utils/preferenceEvents';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchPreferences = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        const prefs = data.user?.preferences;
        if (prefs) {
          setFormData({
            preferredAnimalType: prefs.preferredAnimalType ?? '',
            preferredMaxAge: prefs.preferredMaxAge?.toString() ?? '',
            preferredPersonality: prefs.preferredPersonality ?? '',
            housingType: prefs.housingType ?? '',
            preferredChildFriendly: prefs.preferredChildFriendly ?? false,
          });
        }
      } catch {
        // ignorera fel
      }
    };

    void fetchPreferences();
  }, []);

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
      const data = await response.json();
      notifyUserPreferencesUpdated(data.preferences);
      setSaved(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
    </div>,
    document.body,
  );
}
