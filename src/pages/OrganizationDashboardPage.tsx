import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import styles from "./OrganizationDashboardPage.module.css";

type SectionKey = "overview" | "animals" | "applications" | "add-animal";

type ApplicationStatus =
  | "Inskickad"
  | "Granskas"
  | "Godkänd"
  | "Nekad"
  | "Behöver mer info";

type ApplicationItem = {
  id: number;
  applicant: string;
  animal: string;
  date: string;
  status: ApplicationStatus;
  action: string;
};

type AnimalItem = {
  id: number | string;
  name: string;
  species: string;
  age: string;
  image: string;
  description: string;
  status: "Tillgänglig" | "Reserverad" | "Adopterad";
};

type AnimalFormState = {
  type: string;
  breed: string;
  name: string;
  age: string;
  keyTraits: string;
  personality: string;
  description: string;
  imagePreview: string;
};

const initialApplications: ApplicationItem[] = [
  {
    id: 1,
    applicant: "Anna S.",
    animal: "Luna",
    date: "idag",
    status: "Inskickad",
    action: "Granska",
  },
  {
    id: 2,
    applicant: "Erik L.",
    animal: "Milo",
    date: "igår",
    status: "Granskas",
    action: "Granska",
  },
  {
    id: 3,
    applicant: "Sara K.",
    animal: "Bella",
    date: "2 dgr",
    status: "Godkänd",
    action: "Klar",
  },
  {
    id: 4,
    applicant: "Johan B.",
    animal: "Luna",
    date: "3 dgr",
    status: "Nekad",
    action: "Klar",
  },
];

const initialAnimals: AnimalItem[] = [
  {
    id: 1,
    name: "Luna",
    species: "Katt",
    age: "2 år",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    description:
      "Trygg och social katt som gillar lugna kvällar och stora fönster.",
    status: "Tillgänglig",
  },
  {
    id: 2,
    name: "Milo",
    species: "Hund",
    age: "4 år",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    description:
      "Lekfull och väldigt människoorienterad, passar i aktiv familj.",
    status: "Reserverad",
  },
  {
    id: 3,
    name: "Bella",
    species: "Katt",
    age: "1 år",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
    description: "Nyfiken ung katt som gärna följer efter i hemmet.",
    status: "Adopterad",
  },
];

const statusClassMap: Record<ApplicationStatus, string> = {
  Inskickad: styles.statusSubmitted,
  Granskas: styles.statusReview,
  Godkänd: styles.statusApproved,
  Nekad: styles.statusRejected,
  "Behöver mer info": styles.statusMoreInfo,
};

export default function OrganizationDashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [applications, setApplications] = useState(initialApplications);
  const [animals, setAnimals] = useState(initialAnimals);
  const [formData, setFormData] = useState<AnimalFormState>({
    type: "",
    breed: "",
    name: "",
    age: "",
    keyTraits: "",
    personality: "",
    description: "",
    imagePreview: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/animals");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Array<{
          _id?: string;
          id?: string;
          type: string;
          breed: string;
          image: string;
          name: string;
          age: number;
          keyTraits: string;
          personality?: string;
          description?: string;
        }>;

        if (Array.isArray(data) && data.length > 0) {
          setAnimals(
            data.map((animal, index) => ({
              id: animal._id ?? animal.id ?? `animal-${index + 1}`,
              name: animal.name,
              species: animal.type,
              age: `${animal.age} år`,
              image: animal.image,
              description: animal.description || animal.keyTraits,
              status: "Tillgänglig",
            })),
          );
        }
      } catch {
        // Keep the local mock animals if the API is unavailable.
      }
    };

    loadAnimals();
  }, []);

  const stats = useMemo(() => {
    const reviewCount = applications.filter(
      (item) => item.status === "Inskickad" || item.status === "Granskas",
    ).length;

    return {
      total: animals.length,
      reviewCount,
      newToday: 3,
    };
  }, [applications, animals]);

  const sectionMeta: Record<
    SectionKey,
    { title: string; description: string }
  > = {
    overview: {
      title: "Översikt",
      description:
        "Snabb överblick över ansökningar, djur och vad som behöver hanteras idag.",
    },
    animals: {
      title: "Mina djur",
      description: "Alla djur som organisationen har lagt upp för adoption.",
    },
    applications: {
      title: "Ansökningar",
      description:
        "Se vem som har ansökt om vilket djur och uppdatera statusen.",
    },
    "add-animal": {
      title: "Lägg upp djur",
      description:
        "Skapa ett nytt adoptionsdjur med bild, namn och beskrivning.",
    },
  };

  const handleApplicationAction = (
    id: number,
    nextStatus: ApplicationStatus,
  ) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              action:
                nextStatus === "Godkänd" || nextStatus === "Nekad"
                  ? "Klar"
                  : "Granska",
            }
          : item,
      ),
    );
  };

  const openAnimalModal = () => {
    setSubmitMessage("");
    setIsModalOpen(true);
    setActiveSection("add-animal");
  };

  const closeAnimalModal = () => {
    setIsModalOpen(false);
  };

  const handleSectionClick = (key: SectionKey) => {
    setActiveSection(key);

    if (key === "add-animal") {
      openAnimalModal();
    } else {
      closeAnimalModal();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((current) => ({ ...current, imagePreview: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        imagePreview: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddAnimal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.breed ||
      !formData.age ||
      !formData.keyTraits ||
      !formData.description
    ) {
      setSubmitMessage("Fyll i alla obligatoriska fält.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          breed: formData.breed,
          image:
            formData.imagePreview ||
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
          name: formData.name,
          age: Number(formData.age),
          keyTraits: formData.keyTraits,
          personality: formData.personality,
          description: formData.description,
          likes: [],
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
          err?: unknown;
        };

        if (response.status === 413) {
          setSubmitMessage(
            "Bilden är för stor att skicka. Testa en mindre bildfil (eller komprimera den) och försök igen.",
          );
          return;
        }

        const detailText =
          typeof errorData.err === "string"
            ? errorData.err
            : errorData.err && typeof errorData.err === "object"
              ? JSON.stringify(errorData.err)
              : "";

        setSubmitMessage(
          `${errorData.error || "Kunde inte skapa djuret."} (HTTP ${response.status})${detailText ? ` - ${detailText}` : ""}`,
        );
        return;
      }

      const createdAnimal = (await response.json()) as {
        _id?: string;
        id?: string;
        type: string;
        breed: string;
        image: string;
        name: string;
        age: number;
        keyTraits: string;
        description?: string;
      };

      setAnimals((current) => [
        {
          id: createdAnimal._id ?? createdAnimal.id ?? Date.now(),
          name: createdAnimal.name,
          species: createdAnimal.type,
          age: `${createdAnimal.age} år`,
          image: createdAnimal.image,
          description: createdAnimal.description || createdAnimal.keyTraits,
          status: "Tillgänglig",
        },
        ...current,
      ]);

      setFormData({
        type: "",
        breed: "",
        name: "",
        age: "",
        keyTraits: "",
        personality: "",
        description: "",
        imagePreview: "",
      });
      setIsModalOpen(false);
      setActiveSection("animals");
      setSubmitMessage("Djuret har sparats på servern.");
    } catch {
      setSubmitMessage("Något gick fel när djuret skulle sparas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Min organisation</div>
          <ul className={styles.navList}>
            {[
              { key: "overview", label: "Översikt" },
              { key: "applications", label: "Ansökningar" },
              { key: "animals", label: "Mina djur" },
              { key: "add-animal", label: "Lägg upp djur" },
            ].map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`${styles.navItem} ${activeSection === item.key ? styles.navItemActive : ""}`}
                  onClick={() => handleSectionClick(item.key as SectionKey)}
                >
                  <span className={styles.navDot} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.main}>
          <header className={styles.header}>
            <div>
              <h1>{sectionMeta[activeSection].title}</h1>
              <p>{sectionMeta[activeSection].description}</p>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setActiveSection("applications")}
              >
                Visa ansökningar
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={openAnimalModal}
              >
                Lägg upp djur
              </button>
            </div>
          </header>

          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Totalt</span>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statValue}>{stats.reviewCount}</span>
              <span className={styles.statLabel}>Granskas</span>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statValue}>{stats.newToday}</span>
              <span className={styles.statLabel}>Nya idag</span>
            </article>
          </div>

          <div className={styles.contentGrid}>
            <article className={styles.tableCard}>
              <h2 className={styles.sectionTitle}>Sökande / Djur</h2>
              <div className={styles.tableWrap}>
                <table className={styles.applicationTable}>
                  <thead>
                    <tr>
                      <th>Sökande / Djur</th>
                      <th>Datum</th>
                      <th>Status</th>
                      <th>Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td>
                          <div className={styles.applicantName}>
                            {application.applicant}
                          </div>
                          <div className={styles.animalName}>
                            {application.animal}
                          </div>
                        </td>
                        <td>{application.date}</td>
                        <td>
                          <span
                            className={`${styles.statusPill} ${statusClassMap[application.status]}`}
                          >
                            {application.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.actionLink}
                            onClick={() =>
                              handleApplicationAction(
                                application.id,
                                "Granskas",
                              )
                            }
                          >
                            {application.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.formCard} style={{ marginTop: "22px" }}>
                <h3>Snabba åtgärder</h3>
                <p className={styles.helperText}>
                  Välj ett nytt statusläge för den markerade ansökan.
                </p>
                <div className={styles.badgeRow}>
                  {(
                    [
                      "Granskas",
                      "Godkänd",
                      "Nekad",
                      "Behöver mer info",
                    ] as ApplicationStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={styles.badge}
                      onClick={() => handleApplicationAction(1, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            <div>
              {activeSection === "overview" && (
                <section className={styles.panel}>
                  <h3>Översikt</h3>
                  <p className={styles.helperText}>
                    Det här är en första version av dashboarden. Du kan senare
                    koppla siffrorna till riktiga databasen.
                  </p>
                  <div
                    className={styles.badgeRow}
                    style={{ marginTop: "14px" }}
                  >
                    <span className={styles.badge}>Öppna ansökningar</span>
                    <span className={styles.badge}>Snabb granskning</span>
                    <span className={styles.badge}>Adoptionsflöde</span>
                  </div>
                </section>
              )}

              {activeSection === "animals" && (
                <section className={styles.formCard}>
                  <h3>Mina djur</h3>
                  <div className={styles.compactList}>
                    {animals.map((animal) => (
                      <article key={animal.id} className={styles.animalCard}>
                        <img src={animal.image} alt={animal.name} />
                        <div>
                          <h3>{animal.name}</h3>
                          <p className={styles.animalMeta}>
                            {animal.species} · {animal.age}
                          </p>
                          <p className={styles.helperText}>
                            {animal.description}
                          </p>
                          <div
                            className={styles.badgeRow}
                            style={{ marginTop: "10px" }}
                          >
                            <span className={styles.badge}>
                              {animal.status}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "applications" && (
                <section className={styles.panel}>
                  <h3>Snabba åtgärder</h3>
                  <p className={styles.helperText}>
                    Välj ett nytt statusläge för den markerade ansökan.
                  </p>
                  <div className={styles.badgeRow}>
                    {(
                      [
                        "Granskas",
                        "Godkänd",
                        "Nekad",
                        "Behöver mer info",
                      ] as ApplicationStatus[]
                    ).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={styles.badge}
                        onClick={() => handleApplicationAction(1, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "add-animal" && (
                <section className={styles.formCard}>
                  <h3>Lägg upp djur</h3>
                  <p className={styles.helperText}>
                    Öppna formuläret i popupen för att ladda upp bild och skicka
                    djuret till servern.
                  </p>
                  <div
                    className={styles.badgeRow}
                    style={{ marginTop: "14px" }}
                  >
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={openAnimalModal}
                    >
                      Öppna formulär
                    </button>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => setActiveSection("animals")}
                    >
                      Visa mina djur
                    </button>
                  </div>
                  {submitMessage && (
                    <p
                      className={styles.helperText}
                      style={{ marginTop: "12px" }}
                    >
                      {submitMessage}
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div
              className={styles.modalBackdrop}
              onClick={closeAnimalModal}
              role="presentation"
            >
              <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3>Lägg upp djur</h3>
                    <p className={styles.helperText}>
                      Bilden skickas som data-URL till serverns API.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={closeAnimalModal}
                  >
                    Stäng
                  </button>
                </div>
                <form className={styles.formGrid} onSubmit={handleAddAnimal}>
                  <div className={styles.field}>
                    <label htmlFor="imageFile">Bild</label>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Förhandsvisning"
                        className={styles.imagePreview}
                      />
                    )}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="name">Namn</label>
                    <input
                      id="name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      placeholder="T.ex. Luna"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="type">Typ</label>
                    <input
                      id="type"
                      value={formData.type}
                      onChange={(event) =>
                        setFormData({ ...formData, type: event.target.value })
                      }
                      placeholder="Katt, hund..."
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="breed">Ras</label>
                    <input
                      id="breed"
                      value={formData.breed}
                      onChange={(event) =>
                        setFormData({ ...formData, breed: event.target.value })
                      }
                      placeholder="T.ex. huskatt"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="age">Ålder</label>
                    <input
                      id="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={(event) =>
                        setFormData({ ...formData, age: event.target.value })
                      }
                      placeholder="T.ex. 2"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="keyTraits">Egenskaper</label>
                    <input
                      id="keyTraits"
                      value={formData.keyTraits}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          keyTraits: event.target.value,
                        })
                      }
                      placeholder="T.ex. lugn, social"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="personality">Personlighet</label>
                    <input
                      id="personality"
                      value={formData.personality}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          personality: event.target.value,
                        })
                      }
                      placeholder="Kort beskrivning"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="description">Beskrivning</label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          description: event.target.value,
                        })
                      }
                      placeholder="Kort beskrivning av djuret"
                      required
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={closeAnimalModal}
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Skickar..." : "Publicera djur"}
                    </button>
                  </div>
                  {submitMessage && (
                    <p className={styles.modalMessage}>{submitMessage}</p>
                  )}
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
