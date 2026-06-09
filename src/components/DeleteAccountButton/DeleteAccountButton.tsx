import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getFavoritesStorageKey } from "../../utils/favorites";
import styles from "./DeleteAccountButton.module.css";

export default function DeleteAccountButton() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.role !== "adopter") {
    return null;
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Är du säker? Kontot tas bort permanent och dina ansökningar anonymiseras. Åtgärden går inte att ångra.",
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Du behöver logga in igen innan kontot kan tas bort.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Kontot kunde inte tas bort.");
      }

      localStorage.removeItem(getFavoritesStorageKey(user.id));
      localStorage.removeItem(`pawpals:avatar:image:${user.id}`);
      localStorage.removeItem(`pawpals:avatar:style:${user.id}`);
      logout();
      navigate("/", { replace: true });
    } catch {
      setError("Kontot kunde inte tas bort. Försök igen senare.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDeleteAccount}
        disabled={isDeleting}
      >
        {isDeleting ? "Tar bort konto..." : "Radera mitt konto"}
      </button>
    </>
  );
}
