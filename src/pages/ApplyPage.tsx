import { useState } from "react";
import styles from "./ApplyPage.module.css";

interface ApplicationForm {
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
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
    motivation: "",
    gdprConsent: false,
  });
  return (
    <main>
      <h1>Ansök om adoption</h1>
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
        ></input>
        <label className={styles.formLabel}>Har du erfarenhet av djur?</label>
        <div className="radio-group">
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
      </form>
    </main>
  );
};

export default ApplyPage;
