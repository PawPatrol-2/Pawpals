type AddAnimalSectionProps = {
  submitMessage: string;
  onOpenForm: () => void;
  onGoToAnimals: () => void;
  styles: Record<string, string>;
};

export default function AddAnimalSection({
  submitMessage,
  onOpenForm,
  onGoToAnimals,
  styles,
}: AddAnimalSectionProps) {
  return (
    <section className={styles.formCard}>
      <h3>Lägg upp djur</h3>
      <p className={styles.helperText}>
        Öppna formuläret i popupen för att ladda upp bild och skicka djuret till
        servern.
      </p>
      <div className={styles.badgeRow} style={{ marginTop: "14px" }}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onOpenForm}
        >
          Öppna formulär
        </button>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={onGoToAnimals}
        >
          Visa mina djur
        </button>
      </div>
      {submitMessage && (
        <p className={styles.helperText} style={{ marginTop: "12px" }}>
          {submitMessage}
        </p>
      )}
    </section>
  );
}
