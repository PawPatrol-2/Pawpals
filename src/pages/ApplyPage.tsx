import { useState } from "react";
import styles from "./ApplyPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";

interface ApplicationForm {
  housingType: string;
  housingSize: number | string;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  healthDataConsent: boolean;
  motivation: string;
  gdprConsent: boolean;
}

const ApplyPage = () => {
  const [formData, setFormData] = useState<ApplicationForm>({
    housingType: "",
    housingSize: "",
    hasAnimalExperience: false,
    hasChildren: false,
    hasAllergies: false,
    allergyDetails: "",
    healthDataConsent: false,
    motivation: "",
    gdprConsent: false,
  });

  const { animalId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.housingType) {
      alert("Välj boendetyp!");
      return;
    }
    if (!formData.motivation) {
      alert("Skriv en motivering!");
      return;
    }
    if (formData.hasAllergies && !formData.allergyDetails) {
      alert("Beskriv allergierna!");
      return;
    }
    if (formData.hasAllergies && !formData.healthDataConsent) {
      alert("Du måste lämna samtycke till behandling av dina hälsouppgifter (allergiinformation)!");
      return;
    }
    if (!formData.gdprConsent) {
      alert("Du måste godkänna GDPR-villkoren!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/logga-in");
      return;
    }

    const response = await fetch("http://localhost:3000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, animalId }),
    });

    if (response.status === 409) {
      alert("Du har redan ansökt om detta djur!");
      return;
    }

    if (response.ok) {
      setSubmitted(true);
      setTimeout(() => navigate("/mina-ansokningar"), 2000);
    }
  };

  return (
    <main>
      <h1 className={styles.pageTitle}>Ansök om adoption</h1>
      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
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
                onChange={() =>
                  setFormData({ ...formData, hasChildren: false })
                }
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
                onChange={() =>
                  setFormData({ ...formData, hasAllergies: true })
                }
              />{" "}
              Ja
            </label>
            <label>
              <input
                type="radio"
                name="hasAllergies"
                checked={formData.hasAllergies === false}
                onChange={() =>
                  setFormData({ ...formData, hasAllergies: false })
                }
              />{" "}
              Nej
            </label>
          </div>

          {formData.hasAllergies && (
            <div className={styles.allergySection}>
              <label className={styles.formLabel}>Beskriv allergierna *</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.allergyDetails}
                onChange={(e) =>
                  setFormData({ ...formData, allergyDetails: e.target.value })
                }
                placeholder="T.ex. pälsdjursallergi..."
                required
              />
              <div className={styles.healthDataConsent}>
                <input
                  type="checkbox"
                  id="healthDataConsent"
                  checked={formData.healthDataConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, healthDataConsent: e.target.checked })
                  }
                />
                <label htmlFor="healthDataConsent" className={styles.healthDataConsentLabel}>
                  <strong>Samtycke till behandling av hälsouppgifter (GDPR Art. 9)</strong><br />
                  Jag samtycker uttryckligen till att allergiinformation, som utgör hälsodata och är en känslig personuppgift, behandlas av PawPals för att bedöma lämpligheten av adoptionen. Uppgifterna delas endast med den berörda organisationen och raderas när ansökan avslutas.
                </label>
              </div>
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
              id="gdprConsent"
              checked={formData.gdprConsent}
              onChange={(e) =>
                setFormData({ ...formData, gdprConsent: e.target.checked })
              }
            />
            <label htmlFor="gdprConsent" className={styles.formLabel}>
              Jag godkänner att mina personuppgifter (boendeuppgifter, hushållsinformation och motivering) behandlas av PawPals enligt GDPR för att hantera min adoptionsansökan. Uppgifterna sparas inte längre än nödvändigt.
            </label>
          </div>

          {submitted && (
            <p className={styles.successMessage}>
              🐾 Din ansökan är skickad! Du skickas vidare till dina
              ansökningar...
            </p>
          )}
          <Button
            type="submit"
            text="Skicka ansökan"
            className={styles.submitButton}
          />
        </form>
      </div>
    </main>
  );
};

export default ApplyPage;
