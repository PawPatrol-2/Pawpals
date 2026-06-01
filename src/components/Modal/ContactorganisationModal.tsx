import { useEffect, useState } from 'react';
import styles from './ContactOrganisationModal.module.css';

interface ContactOrganisationModalProps {
  applicationId: string;
  animalName: string;
  onClose: () => void;
}

type ContactInfo = {
  name: string;
  email: string;
};

export default function ContactOrganisationModal({
  applicationId,
  animalName,
  onClose,
}: ContactOrganisationModalProps) {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/applications/${applicationId}/organisation-contact`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error('Kunde inte hämta kontaktinfo');
        const data = await response.json();
        setContact(data);
      } catch {
        setError('Något gick fel. Försök igen senare.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchContact();
  }, [applicationId]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Kontakta organisationen</h2>
        <p className={styles.subtitle}>
          Din ansökan för <strong>{animalName}</strong> är godkänd!
        </p>

        {isLoading && <p className={styles.loading}>Hämtar kontaktuppgifter...</p>}

        {error && <p className={styles.error}>{error}</p>}

        {contact && (
          <div className={styles.contactCard}>
            <div className={styles.contactRow}>
              <span className={styles.label}>Organisation</span>
              <span className={styles.value}>{contact.name}</span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.label}>E-post</span>
              <a className={styles.email} href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          </div>
        )}

        <button className={styles.closeButton} onClick={onClose}>
          Stäng
        </button>
      </div>
    </div>
  );
}
