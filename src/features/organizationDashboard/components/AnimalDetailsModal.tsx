import type { FormEvent } from "react";
import type { AnimalFormState, AnimalItem } from "../types";

type AnimalDetailsModalProps = {
  isOpen: boolean;
  selectedAnimal: AnimalItem | null;
  editData: AnimalFormState | null;
  canEditSelectedAnimal: boolean;
  isEditMode: boolean;
  isSavingEdit: boolean;
  isDeletingAnimal: boolean;
  editMessage: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldChange: <K extends keyof AnimalFormState>(
    field: K,
    value: AnimalFormState[K],
  ) => void;
  styles: Record<string, string>;
};

export default function AnimalDetailsModal({
  isOpen,
  selectedAnimal,
  editData,
  canEditSelectedAnimal,
  isEditMode,
  isSavingEdit,
  isDeletingAnimal,
  editMessage,
  onClose,
  onSubmit,
  onStartEdit,
  onCancelEdit,
  onDelete,
  onImageChange,
  onFieldChange,
  styles,
}: AnimalDetailsModalProps) {
  if (!isOpen || !selectedAnimal || !editData) {
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
            <h3>{selectedAnimal.name}</h3>
            <p className={styles.helperText}>
              {canEditSelectedAnimal
                ? "Detta djur är uppladdat av din organisation. Du kan redigera uppgifterna."
                : "Du kan visa information men inte redigera djur som laddats upp av andra organisationer."}
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
            <label htmlFor="editImageFile">Byt bild</label>
            <input
              id="editImageFile"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              disabled={!canEditSelectedAnimal || !isEditMode}
            />
            {editData.imagePreview && (
              <img
                src={editData.imagePreview}
                alt="Nuvarande bild"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="editName">Namn</label>
            <input
              id="editName"
              value={editData.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editType">Typ</label>
            <input
              id="editType"
              value={editData.type}
              onChange={(event) => onFieldChange("type", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editBreed">Ras</label>
            <input
              id="editBreed"
              value={editData.breed}
              onChange={(event) => onFieldChange("breed", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editAge">Ålder</label>
            <input
              id="editAge"
              type="number"
              min="0"
              value={editData.age}
              onChange={(event) => onFieldChange("age", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editTraits">Egenskaper</label>
            <input
              id="editTraits"
              value={editData.keyTraits}
              onChange={(event) =>
                onFieldChange("keyTraits", event.target.value)
              }
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editLikes">Tycker om</label>
            <input
              id="editLikes"
              value={editData.likes}
              onChange={(event) => onFieldChange("likes", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              placeholder="T.ex. promenader, kel, lek"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editCity">Stad</label>
            <input
              id="editCity"
              value={editData.city}
              onChange={(event) => onFieldChange("city", event.target.value)}
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel} htmlFor="editChildFriendly">
              <input
                id="editChildFriendly"
                className={styles.checkboxInput}
                type="checkbox"
                checked={editData.childFriendly}
                onChange={(event) =>
                  onFieldChange("childFriendly", event.target.checked)
                }
                disabled={!canEditSelectedAnimal || !isEditMode}
              />
              Barnvänlig
            </label>
          </div>

          <div className={styles.field}>
            <label htmlFor="editPersonality">Personlighet</label>
            <input
              id="editPersonality"
              value={editData.personality}
              onChange={(event) =>
                onFieldChange("personality", event.target.value)
              }
              disabled={!canEditSelectedAnimal || !isEditMode}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="editDescription">Beskrivning</label>
            <textarea
              id="editDescription"
              value={editData.description}
              onChange={(event) =>
                onFieldChange("description", event.target.value)
              }
              disabled={!canEditSelectedAnimal || !isEditMode}
              required
            />
          </div>

          {canEditSelectedAnimal && !isEditMode && (
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={onStartEdit}
              >
                Redigera
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={onDelete}
                disabled={isDeletingAnimal}
              >
                {isDeletingAnimal ? "Tar bort..." : "Ta bort"}
              </button>
            </div>
          )}

          {canEditSelectedAnimal && isEditMode && (
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={onCancelEdit}
              >
                Avbryt
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSavingEdit}
              >
                {isSavingEdit ? "Sparar..." : "Spara ändringar"}
              </button>
            </div>
          )}

          {editMessage && <p className={styles.modalMessage}>{editMessage}</p>}
        </form>
      </div>
    </div>
  );
}
