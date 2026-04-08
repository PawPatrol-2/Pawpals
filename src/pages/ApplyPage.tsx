import { useState } from "react";

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
      <form>
        <label className="housing-type">Boendetyp</label>
        <select
          className="form-housetype"
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
        <label className="label-name">Storlek på bostad (kvm)</label>
        <input
          type="number"
          className="form-input"
          value={formData.housingSize}
          onChange={(e) =>
            setFormData({ ...formData, housingSize: Number(e.target.value) })
          }
        ></input>
      </form>
    </main>
  );
};

export default ApplyPage;
