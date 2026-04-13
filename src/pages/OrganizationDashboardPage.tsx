import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import styles from "./OrganizationDashboardPage.module.css";
import { useUser } from "../context/UserContext";
import { sortAnimalsNewestFirst } from "../utils/sortAnimalsNewestFirst";

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
  mongoId?: string;
  createdAt?: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  keyTraits: string;
  personality?: string;
  image: string;
  description: string;
  organizationOwner?: string;
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
  imageFile: File | null;
};

const resolveImageUrl = (image: string) => {
  if (!image) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `http://localhost:3000${image}`;
  }

  return image;
};

const normalizeImageForApi = (image: string) => {
  const prefix = "http://localhost:3000/uploads/";

  if (image.startsWith(prefix)) {
    return `/uploads/${image.slice(prefix.length)}`;
  }

  return image;
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
    mongoId: undefined,
    name: "Luna",
    type: "Katt",
    breed: "Huskatt",
    age: "2 år",
    keyTraits: "Trygg, social",
    personality: "Lugn",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    description:
      "Trygg och social katt som gillar lugna kvällar och stora fönster.",
    organizationOwner: "Annan Organisation",
    status: "Tillgänglig",
  },
  {
    id: 2,
    mongoId: undefined,
    name: "Milo",
    type: "Hund",
    breed: "Blandras",
    age: "4 år",
    keyTraits: "Lekfull, energisk",
    personality: "Aktiv",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    description:
      "Lekfull och väldigt människoorienterad, passar i aktiv familj.",
    organizationOwner: "Annan Organisation",
    status: "Reserverad",
  },
  {
    id: 3,
    mongoId: undefined,
    name: "Bella",
    type: "Katt",
    breed: "Huskatt",
    age: "1 år",
    keyTraits: "Nyfiken, kärleksfull",
    personality: "Social",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
    description: "Nyfiken ung katt som gärna följer efter i hemmet.",
    organizationOwner: "Annan Organisation",
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
  const { user } = useUser();
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
    imageFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem | null>(null);
  const [isAnimalDetailsOpen, setIsAnimalDetailsOpen] = useState(false);
  const [editData, setEditData] = useState<AnimalFormState | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeletingAnimal, setIsDeletingAnimal] = useState(false);

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
          createdAt?: string;
          type: string;
          breed: string;
          image: string;
          name: string;
          age: number;
          keyTraits: string;
          personality?: string;
          description?: string;
          organizationOwner?: string;
        }>;

        if (Array.isArray(data) && data.length > 0) {
          const ownerAnimals = sortAnimalsNewestFirst(data)
            .filter((animal) => animal.organizationOwner === user?.username)
            .map((animal, index) => ({
              id: animal._id ?? animal.id ?? `animal-${index + 1}`,
              mongoId: animal._id ?? animal.id,
              createdAt: animal.createdAt,
              name: animal.name,
              type: animal.type,
              breed: animal.breed,
              age: `${animal.age} år`,
              keyTraits: animal.keyTraits,
              personality: animal.personality,
              image: resolveImageUrl(animal.image),
              description: animal.description || animal.keyTraits,
              organizationOwner: animal.organizationOwner,
              status: "Tillgänglig",
            }));

          setAnimals(ownerAnimals);
        }
      } catch {
        // Keep the local mock animals if the API is unavailable.
      }
    };

    loadAnimals();
  }, [user?.username]);

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
      setFormData((current) => ({
        ...current,
        imagePreview: "",
        imageFile: null,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        imagePreview: typeof reader.result === "string" ? reader.result : "",
        imageFile: file,
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
      const payload = new FormData();
      payload.append("type", formData.type);
      payload.append("breed", formData.breed);
      payload.append("name", formData.name);
      payload.append("age", String(Number(formData.age)));
      payload.append("keyTraits", formData.keyTraits);
      payload.append("personality", formData.personality);
      payload.append("description", formData.description);
      payload.append("organizationOwner", user?.username || "");

      if (formData.imageFile) {
        payload.append("imageFile", formData.imageFile);
      } else {
        payload.append(
          "image",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        );
      }

      const response = await fetch("http://localhost:3000/api/animals", {
        method: "POST",
        body: payload,
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
        personality?: string;
        organizationOwner?: string;
        description?: string;
      };

      setAnimals((current) => [
        {
          id: createdAnimal._id ?? createdAnimal.id ?? Date.now(),
          mongoId: createdAnimal._id ?? createdAnimal.id,
          name: createdAnimal.name,
          type: createdAnimal.type,
          breed: createdAnimal.breed,
          age: `${createdAnimal.age} år`,
          keyTraits: createdAnimal.keyTraits,
          personality: createdAnimal.personality,
          image: resolveImageUrl(createdAnimal.image),
          description: createdAnimal.description || createdAnimal.keyTraits,
          organizationOwner: createdAnimal.organizationOwner || user?.username,
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
        imageFile: null,
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

  const getAgeNumber = (ageText: string) => {
    const parsed = Number.parseInt(ageText, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const buildEditDataFromAnimal = (animal: AnimalItem): AnimalFormState => ({
    type: animal.type,
    breed: animal.breed,
    name: animal.name,
    age: String(getAgeNumber(animal.age)),
    keyTraits: animal.keyTraits,
    personality: animal.personality || "",
    description: animal.description,
    imagePreview: animal.image,
    imageFile: null,
  });

  const openAnimalDetails = (animal: AnimalItem) => {
    setSelectedAnimal(animal);
    setEditData(buildEditDataFromAnimal(animal));
    setEditMessage("");
    setIsEditMode(false);
    setIsAnimalDetailsOpen(true);
  };

  const closeAnimalDetails = () => {
    setIsAnimalDetailsOpen(false);
    setSelectedAnimal(null);
    setEditData(null);
    setEditMessage("");
    setIsEditMode(false);
  };

  const canEditSelectedAnimal =
    !!selectedAnimal &&
    !!user?.username &&
    selectedAnimal.organizationOwner === user.username;

  const startEditingSelectedAnimal = () => {
    if (!canEditSelectedAnimal) {
      return;
    }

    setEditMessage("");
    setIsEditMode(true);
  };

  const cancelEditingSelectedAnimal = () => {
    if (selectedAnimal) {
      setEditData(buildEditDataFromAnimal(selectedAnimal));
    }

    setEditMessage("");
    setIsEditMode(false);
  };

  const handleSaveAnimalEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAnimal || !editData || !user?.username) {
      return;
    }

    if (!selectedAnimal.mongoId) {
      setEditMessage(
        "Det här djuret saknar databas-id och kan inte uppdateras. Ladda om sidan och testa igen.",
      );
      return;
    }

    if (
      !editData.name ||
      !editData.type ||
      !editData.breed ||
      !editData.age ||
      !editData.keyTraits ||
      !editData.description
    ) {
      setEditMessage("Fyll i alla obligatoriska fält.");
      return;
    }

    setIsSavingEdit(true);
    setEditMessage("");

    try {
      const payload = new FormData();
      payload.append("type", editData.type);
      payload.append("breed", editData.breed);
      payload.append("name", editData.name);
      payload.append("age", String(Number(editData.age)));
      payload.append("keyTraits", editData.keyTraits);
      payload.append("personality", editData.personality);
      payload.append("description", editData.description);
      payload.append("requester", user.username);

      if (editData.imageFile) {
        payload.append("imageFile", editData.imageFile);
      } else {
        payload.append("image", normalizeImageForApi(editData.imagePreview));
      }

      const response = await fetch(
        `http://localhost:3000/api/animals/${selectedAnimal.mongoId}`,
        {
          method: "PUT",
          body: payload,
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        _id?: string;
        type?: string;
        breed?: string;
        image?: string;
        name?: string;
        age?: number;
        keyTraits?: string;
        personality?: string;
        description?: string;
        organizationOwner?: string;
      };

      if (!response.ok) {
        if (response.status === 404) {
          setEditMessage(
            "Djuret hittades inte i databasen (HTTP 404). Om servern nyligen ändrats, starta om backend och ladda om sidan.",
          );
          return;
        }

        setEditMessage(
          `${data.error || "Kunde inte spara ändringarna."} (HTTP ${response.status})`,
        );
        return;
      }

      setAnimals((current) =>
        current.map((animal) =>
          String(animal.id) === String(selectedAnimal.id)
            ? {
                ...animal,
                name: data.name || editData.name,
                type: data.type || editData.type,
                breed: data.breed || editData.breed,
                age: `${data.age ?? Number(editData.age)} år`,
                keyTraits: data.keyTraits || editData.keyTraits,
                personality: data.personality || editData.personality,
                image: resolveImageUrl(data.image || editData.imagePreview),
                description: data.description || editData.description,
                organizationOwner:
                  data.organizationOwner || animal.organizationOwner,
              }
            : animal,
        ),
      );

      setEditMessage("Ändringarna sparades.");
      setIsEditMode(false);
    } catch {
      setEditMessage("Något gick fel när djuret skulle uppdateras.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteAnimal = async () => {
    if (!selectedAnimal || !selectedAnimal.mongoId || !user?.username) {
      return;
    }

    const shouldDelete = window.confirm(
      `Är du säker på att du vill ta bort ${selectedAnimal.name}?`,
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeletingAnimal(true);
    setEditMessage("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/animals/${selectedAnimal.mongoId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requester: user.username }),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setEditMessage(
          `${data.error || "Kunde inte ta bort djuret."} (HTTP ${response.status})`,
        );
        return;
      }

      setAnimals((current) =>
        current.filter(
          (animal) => String(animal.id) !== String(selectedAnimal.id),
        ),
      );
      closeAnimalDetails();
      setActiveSection("animals");
      setSubmitMessage("Djuret togs bort från servern.");
    } catch {
      setEditMessage("Något gick fel när djuret skulle tas bort.");
    } finally {
      setIsDeletingAnimal(false);
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
                      <article
                        key={animal.id}
                        className={`${styles.animalCard} ${styles.clickableCard}`}
                        onClick={() => openAnimalDetails(animal)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openAnimalDetails(animal);
                          }
                        }}
                      >
                        <img src={animal.image} alt={animal.name} />
                        <div>
                          <h3>{animal.name}</h3>
                          <p className={styles.animalMeta}>
                            {animal.type} · {animal.breed} · {animal.age}
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
                            {animal.organizationOwner && (
                              <span className={styles.badge}>
                                {animal.organizationOwner === user?.username
                                  ? "Ditt djur"
                                  : "Annan organisation"}
                              </span>
                            )}
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

          {isAnimalDetailsOpen && selectedAnimal && editData && (
            <div
              className={styles.modalBackdrop}
              onClick={closeAnimalDetails}
              role="presentation"
            >
              <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3>{selectedAnimal.name}</h3>
                    <p className={styles.helperText}>
                      {canEditSelectedAnimal
                        ? "Detta djur är uppladdat av din organisation. Du kan redigera uppgifterna."
                        : "Du kan visa information men inte redigera djur som laddats upp av andra organisationer."}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={closeAnimalDetails}
                  >
                    Stäng
                  </button>
                </div>

                <form
                  className={styles.formGrid}
                  onSubmit={handleSaveAnimalEdit}
                >
                  <div className={styles.field}>
                    <label htmlFor="editImageFile">Byt bild</label>
                    <input
                      id="editImageFile"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        if (!file) {
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setEditData({
                            ...editData,
                            imagePreview:
                              typeof reader.result === "string"
                                ? reader.result
                                : editData.imagePreview,
                            imageFile: file,
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                      disabled={!canEditSelectedAnimal || !isEditMode}
                    />
                    {editData.imagePreview && (
                      <img
                        src={editData.imagePreview}
                        alt="Nuvarande bild"
                        className={styles.imagePreview}
                      />
                    )}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editName">Namn</label>
                    <input
                      id="editName"
                      value={editData.name}
                      onChange={(event) =>
                        setEditData({ ...editData, name: event.target.value })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editType">Typ</label>
                    <input
                      id="editType"
                      value={editData.type}
                      onChange={(event) =>
                        setEditData({ ...editData, type: event.target.value })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editBreed">Ras</label>
                    <input
                      id="editBreed"
                      value={editData.breed}
                      onChange={(event) =>
                        setEditData({ ...editData, breed: event.target.value })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editAge">Ålder</label>
                    <input
                      id="editAge"
                      type="number"
                      min="0"
                      value={editData.age}
                      onChange={(event) =>
                        setEditData({ ...editData, age: event.target.value })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editTraits">Egenskaper</label>
                    <input
                      id="editTraits"
                      value={editData.keyTraits}
                      onChange={(event) =>
                        setEditData({
                          ...editData,
                          keyTraits: event.target.value,
                        })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editPersonality">Personlighet</label>
                    <input
                      id="editPersonality"
                      value={editData.personality}
                      onChange={(event) =>
                        setEditData({
                          ...editData,
                          personality: event.target.value,
                        })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="editDescription">Beskrivning</label>
                    <textarea
                      id="editDescription"
                      value={editData.description}
                      onChange={(event) =>
                        setEditData({
                          ...editData,
                          description: event.target.value,
                        })
                      }
                      disabled={!canEditSelectedAnimal || !isEditMode}
                      required
                    />
                  </div>
                  {canEditSelectedAnimal && !isEditMode && (
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={startEditingSelectedAnimal}
                      >
                        Redigera
                      </button>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={handleDeleteAnimal}
                        disabled={isDeletingAnimal}
                      >
                        {isDeletingAnimal ? "Tar bort..." : "Ta bort"}
                      </button>
                    </div>
                  )}
                  {canEditSelectedAnimal && isEditMode && (
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={cancelEditingSelectedAnimal}
                      >
                        Avbryt
                      </button>
                      <button
                        type="submit"
                        className={styles.primaryButton}
                        disabled={isSavingEdit}
                      >
                        {isSavingEdit ? "Sparar..." : "Spara ändringar"}
                      </button>
                    </div>
                  )}
                  {editMessage && (
                    <p className={styles.modalMessage}>{editMessage}</p>
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
