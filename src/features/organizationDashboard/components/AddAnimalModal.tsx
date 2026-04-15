import type { FormEvent } from "react";
import type { AnimalFormState } from "../types";

type AddAnimalModalProps = {
  isOpen: boolean;
  formData: AnimalFormState;
  isSubmitting: boolean;
  submitMessage: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldChange: <K extends keyof AnimalFormState>(
    field: K,
    value: AnimalFormState[K],
  ) => void;
  styles: Record<string, string>;
};

export default function AddAnimalModal({
  isOpen,
  formData,
  isSubmitting,
  submitMessage,
  onClose,
  onSubmit,
  onImageChange,
  onFieldChange,
  styles,
}: AddAnimalModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h3>Lägg upp djur</h3>
            <p className={styles.helperText}>
              Bilden skickas till serverns API.
            </p>
          </div>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={onClose}
          >
            Stäng
          </button>
        </div>

        <form className={styles.formGrid} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label htmlFor="imageFile">Bild</label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Förhandsvisning"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="name">Namn</label>
            <input
              id="name"
              value={formData.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="T.ex. Luna"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="type">Typ</label>
            <input
              id="type"
              value={formData.type}
              onChange={(event) => onFieldChange("type", event.target.value)}
              placeholder="Katt, hund..."
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="breed">Ras</label>
            <input
              id="breed"
              value={formData.breed}
              onChange={(event) => onFieldChange("breed", event.target.value)}
              placeholder="T.ex. huskatt"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="age">Ålder</label>
            <input
              id="age"
              type="number"
              min="0"
              value={formData.age}
              onChange={(event) => onFieldChange("age", event.target.value)}
              placeholder="T.ex. 2"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="keyTraits">Egenskaper</label>
            <input
              id="keyTraits"
              value={formData.keyTraits}
              onChange={(event) =>
                onFieldChange("keyTraits", event.target.value)
              }
              placeholder="T.ex. lugn, social"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="personality">Personlighet</label>
            <input
              id="personality"
              value={formData.personality}
              onChange={(event) =>
                onFieldChange("personality", event.target.value)
              }
              placeholder="Kort beskrivning"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                onFieldChange("description", event.target.value)
              }
              placeholder="Kort beskrivning av djuret"
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={onClose}
            >
              Avbryt
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Skickar..." : "Publicera djur"}
            </button>
          </div>

          {submitMessage && (
            <p className={styles.modalMessage}>{submitMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
