import { useState } from "react"

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
        <label>Boendetyp</label>
          <select className="Ansökan" value={formData.housingType} onChange={(e) => setFormData({ ...formData, housingType: e.target.value })} 
          >
          <option value="">Välj boendetyp</option>
          <option value="lagenhet">Lägenhet</option>
          <option value="villa">Villa</option>
          <option value="radhus">Radhus</option>
          </select>
      </form>
    </main>
  );
};

export default ApplyPage;
