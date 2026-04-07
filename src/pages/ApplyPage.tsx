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
  return (
    <main>
      <h1>Ansök om adoption</h1>
    </main>
  );
};

export default ApplyPage;
