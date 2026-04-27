import { useMemo, useState, type FormEvent } from "react";
import styles from "./OrganizationDashboardPage.module.css";
import { useUser } from "../context/UserContext";
import {
  navItems,
  sectionMeta,
} from "../features/organizationDashboard/constants";
import type {
  ApplicationStatus,
  SectionKey,
} from "../features/organizationDashboard/types";
import { useOrganizationApplications } from "../features/organizationDashboard/hooks/useOrganizationApplications";
import { useOrganizationAnimals } from "../features/organizationDashboard/hooks/useOrganizationAnimals";
import SidebarNav from "../features/organizationDashboard/components/SidebarNav";
import DashboardHeader from "../features/organizationDashboard/components/DashboardHeader";
import OverviewSection from "../features/organizationDashboard/components/OverviewSection";
import ApplicationsSection from "../features/organizationDashboard/components/ApplicationsSection";
import AnimalsSection from "../features/organizationDashboard/components/AnimalsSection";
import AddAnimalSection from "../features/organizationDashboard/components/AddAnimalSection";
import AddAnimalModal from "../features/organizationDashboard/components/AddAnimalModal";
import AnimalDetailsModal from "../features/organizationDashboard/components/AnimalDetailsModal";

const statusClassMap: Record<ApplicationStatus, string> = {
  Inskickad: styles.statusSubmitted,
  Granskas: styles.statusReview,
  Godkänd: styles.statusApproved,
  Nekad: styles.statusRejected,
  "Behöver mer info": styles.statusMoreInfo,
};

export default function OrganizationDashboardPage() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  const { applications, updateApplicationStatus, overviewStats, reviewCount } =
    useOrganizationApplications(user?.username);

  const {
    animals,
    formData,
    isModalOpen,
    isSubmitting,
    submitMessage,
    selectedAnimal,
    isAnimalDetailsOpen,
    editData,
    editMessage,
    isSavingEdit,
    isEditMode,
    isDeletingAnimal,
    canEditSelectedAnimal,
    setSubmitMessage,
    updateFormField,
    updateEditField,
    onAddImageChange,
    onEditImageChange,
    openAnimalModal,
    closeAnimalModal,
    submitAddAnimal,
    openAnimalDetails,
    closeAnimalDetails,
    startEditingSelectedAnimal,
    cancelEditingSelectedAnimal,
    saveSelectedAnimalEdit,
    deleteSelectedAnimal,
  } = useOrganizationAnimals(user?.username);

  const stats = useMemo(
    () => ({
      total: animals.length,
      reviewCount,
      newToday: 3,
    }),
    [animals.length, reviewCount],
  );

  const handleOpenAnimalModal = () => {
    openAnimalModal();
    setActiveSection("add-animal");
  };

  const handleSectionClick = (key: SectionKey) => {
    setActiveSection(key);

    if (key === "add-animal") {
      openAnimalModal();
    } else {
      closeAnimalModal();
    }
  };

  const handleAddAnimalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await submitAddAnimal();

    if (success) {
      setActiveSection("animals");
    }
  };

  const handleEditAnimalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveSelectedAnimalEdit();
  };

  const handleDeleteAnimal = async () => {
    const success = await deleteSelectedAnimal();

    if (success) {
      setActiveSection("animals");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SidebarNav
          activeSection={activeSection}
          navItems={navItems}
          onSectionClick={handleSectionClick}
          styles={styles}
        />

        <section className={styles.main}>
          <DashboardHeader
            activeSection={activeSection}
            sectionMeta={sectionMeta}
            onOpenApplications={() => setActiveSection("applications")}
            onOpenAddAnimal={handleOpenAnimalModal}
            styles={styles}
          />

          {activeSection === "overview" && (
            <OverviewSection
              stats={stats}
              overviewStats={overviewStats}
              applications={applications}
              styles={styles}
            />
          )}

          {activeSection === "applications" && (
            <ApplicationsSection
              applications={applications}
              overviewStats={overviewStats}
              statusClassMap={statusClassMap}
              onUpdateStatus={updateApplicationStatus}
              styles={styles}
            />
          )}

          {activeSection === "animals" && (
            <AnimalsSection
              animals={animals}
              onOpenAnimalDetails={openAnimalDetails}
              styles={styles}
            />
          )}

          {activeSection === "add-animal" && (
            <AddAnimalSection
              submitMessage={submitMessage}
              onOpenForm={handleOpenAnimalModal}
              onGoToAnimals={() => setActiveSection("animals")}
              styles={styles}
            />
          )}

          <AddAnimalModal
            isOpen={isModalOpen}
            formData={formData}
            isSubmitting={isSubmitting}
            submitMessage={submitMessage}
            onClose={closeAnimalModal}
            onSubmit={handleAddAnimalSubmit}
            onImageChange={onAddImageChange}
            onFieldChange={updateFormField}
            styles={styles}
          />

          <AnimalDetailsModal
            isOpen={isAnimalDetailsOpen}
            selectedAnimal={selectedAnimal}
            editData={editData}
            canEditSelectedAnimal={canEditSelectedAnimal}
            isEditMode={isEditMode}
            isSavingEdit={isSavingEdit}
            isDeletingAnimal={isDeletingAnimal}
            editMessage={editMessage}
            onClose={closeAnimalDetails}
            onSubmit={handleEditAnimalSubmit}
            onStartEdit={startEditingSelectedAnimal}
            onCancelEdit={cancelEditingSelectedAnimal}
            onDelete={handleDeleteAnimal}
            onImageChange={onEditImageChange}
            onFieldChange={updateEditField}
            styles={styles}
          />
        </section>
      </div>
    </main>
  );
}
