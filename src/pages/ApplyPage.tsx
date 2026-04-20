import { useState } from "react";
import styles from "./ApplyPage.module.css";
import Button from "../components/Button/Button";

interface ApplicationForm {
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  motivation: string;
  gdprConsent: boolean;
}

const ApplyPage = () => {
  const [formData, setFormData] = useState<ApplicationForm>({
    housingType: "",
    housingSize: 0,
    hasAnimalExperience: false,
    hasChildren: false,
    hasAllergies: false,
    allergyDetails: "",
    motivation: "",
    gdprConsent: false,
  });

  return (
    <main>
      <h1 className={styles.pageTitle}>Ansök om adoption</h1>
      <form className={styles.form}>
        <label className={styles.housingType}>Boendetyp</label>
        <select
          className={styles.formHousetype}
          value={formData.housingType}
          onChange={(e) =>
            setFormData({ ...formData, housingType: e.target.value })
          }
        >
          <option value="">Välj boendetyp</option>
          <option value="lagenhet">Lägenhet</option>
          <option value="villa">Villa</option>
          <option value="radhus">Radhus</option>
        </select>

        <label className={styles.labelName}>Storlek på bostad (kvm)</label>
        <input
          type="number"
          className={styles.formInput}
          value={formData.housingSize}
          onChange={(e) =>
            setFormData({ ...formData, housingSize: Number(e.target.value) })
          }
        />

        <label className={styles.formLabel}>Har du erfarenhet av djur?</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="hasAnimalExperience"
              checked={formData.hasAnimalExperience === true}
              onChange={() =>
                setFormData({ ...formData, hasAnimalExperience: true })
              }
            />{" "}
            Ja
          </label>
          <label>
            <input
              type="radio"
              name="hasAnimalExperience"
              checked={formData.hasAnimalExperience === false}
              onChange={() =>
                setFormData({ ...formData, hasAnimalExperience: false })
              }
            />{" "}
            Nej
          </label>
        </div>

        <label className={styles.formLabel}>Finns det barn i hemmet?</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="hasChildren"
              checked={formData.hasChildren === true}
              onChange={() => setFormData({ ...formData, hasChildren: true })}
            />{" "}
            Ja
          </label>
          <label>
            <input
              type="radio"
              name="hasChildren"
              checked={formData.hasChildren === false}
              onChange={() => setFormData({ ...formData, hasChildren: false })}
            />{" "}
            Nej
          </label>
        </div>

        <label className={styles.formLabel}>
          Finns det allergier i hemmet?
        </label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="hasAllergies"
              checked={formData.hasAllergies === true}
              onChange={() => setFormData({ ...formData, hasAllergies: true })}
            />{" "}
            Ja
          </label>
          <label>
            <input
              type="radio"
              name="hasAllergies"
              checked={formData.hasAllergies === false}
              onChange={() => setFormData({ ...formData, hasAllergies: false })}
            />{" "}
            Nej
          </label>
        </div>

        {formData.hasAllergies && (
          <div>
            <label className={styles.formLabel}>Beskriv allergierna</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.allergyDetails}
              onChange={(e) =>
                setFormData({ ...formData, allergyDetails: e.target.value })
              }
              placeholder="T.ex. pälsdjursallergi..."
            />
          </div>
        )}

        <label className={styles.formLabel}>Motivering</label>
        <textarea
          className={styles.formTextarea}
          value={formData.motivation}
          onChange={(e) =>
            setFormData({ ...formData, motivation: e.target.value })
          }
          placeholder="Berätta varför du vill adoptera..."
        />

        <div className={styles.gdprConsent}>
          <input
            type="checkbox"
            checked={formData.gdprConsent}
            onChange={(e) =>
              setFormData({ ...formData, gdprConsent: e.target.checked })
            }
          />
          <label className={styles.formLabel}>
            Jag godkänner att mina uppgifter behandlas enligt GDPR. Uppgifterna
            används endast för att hantera din adoptionsansökan.
          </label>
        </div>

        <Button
          type="submit"
          text="Skicka ansökan"
          className={styles.submitButton}
        />
      </form>
    </main>
  );
};

export default ApplyPage;
