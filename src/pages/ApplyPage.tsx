import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ApplyPage.module.css";
import Button from "../components/Button/Button";
import { useUser } from "../context/UserContext";

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
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useUser();

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      navigate("/logga-in");
      return;
    }

    if (!animalId) {
      setIsSuccess(false);
      setMessage("Vi kunde inte hitta vilket djur du vill ansöka om.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      navigate("/logga-in");
      return;
    }

    if (!formData.housingType || !formData.motivation.trim()) {
      setIsSuccess(false);
      setMessage("Fyll i boendetyp och motivering.");
      return;
    }

    if (!formData.gdprConsent) {
      setIsSuccess(false);
      setMessage("Du behöver godkänna GDPR för att skicka ansökan.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animalId,
          housingType: formData.housingType,
          housingSize: formData.housingSize,
          hasAnimalExperience: formData.hasAnimalExperience,
          hasChildren: formData.hasChildren,
          hasAllergies: formData.hasAllergies,
          allergyDetails: formData.hasAllergies
            ? formData.allergyDetails.trim()
            : "",
          motivation: formData.motivation.trim(),
          gdprConsent: formData.gdprConsent,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate("/logga-in");
        return;
      }

      if (!response.ok) {
        throw new Error(
          (data as { message?: string }).message ?? "Kunde inte skicka ansökan."
        );
      }

      setIsSuccess(true);
      setMessage("Ansökan skickad! Du skickas till Mina ansökningar...");
      setTimeout(() => {
        navigate("/mina-ansokningar");
      }, 500);
    } catch (error: unknown) {
      setIsSuccess(false);
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Något gick fel. Försök igen.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className={styles.pageTitle}>Ansök om adoption</h1>
      {!animalId && (
        <p className={styles.missingAnimal}>
          Inget djur valt. Gå tillbaka till ett djurkort och öppna ansökan därifrån.
        </p>
      )}
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
          text={isSubmitting ? "Skickar..." : "Skicka ansökan"}
          className={styles.submitButton}
          disabled={isSubmitting || !animalId}
        />
        {message && (
          <p
            className={`${styles.statusMessage} ${
              isSuccess ? styles.statusSuccess : styles.statusError
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
};

export default ApplyPage;
