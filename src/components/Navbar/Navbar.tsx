import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Navbar.css";

const avatarStyles = ["sun", "sea", "mint", "berry"] as const;
type AvatarStyle = (typeof avatarStyles)[number];

export default function Navbar() {
  const { user, isAuthLoading, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>("sun");
  const [avatarError, setAvatarError] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  const storageImageKey = useMemo(
    () => (user ? `pawpals:avatar:image:${user.id}` : ""),
    [user],
  );
  const storageStyleKey = useMemo(
    () => (user ? `pawpals:avatar:style:${user.id}` : ""),
    [user],
  );

  const userInitials = useMemo(() => {
    if (!user) return "PP";
    const source = user.username?.trim() || user.email?.trim() || "PawPals";
    const words = source.split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const savedImage = localStorage.getItem(storageImageKey);
    const savedStyle = localStorage.getItem(storageStyleKey) as AvatarStyle | null;

    const frameId = window.requestAnimationFrame(() => {
      setAvatarImage(savedImage);
      if (savedStyle && avatarStyles.includes(savedStyle)) {
        setAvatarStyle(savedStyle);
      } else {
        setAvatarStyle("sun");
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [storageImageKey, storageStyleKey, user]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleStylePick = (style: AvatarStyle) => {
    setAvatarStyle(style);
    setAvatarImage(null);
    setAvatarError("");
    if (storageStyleKey) localStorage.setItem(storageStyleKey, style);
    if (storageImageKey) localStorage.removeItem(storageImageKey);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Välj en bildfil.");
      return;
    }

    if (file.size > 1_000_000) {
      setAvatarError("Bilden är för stor (max 1 MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setAvatarImage(result);
      setAvatarError("");
      localStorage.setItem(storageImageKey, result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" style={{ fontWeight: 700 }}>
        <span style={{ color: '#E8713A', fontSize: '1.4rem', marginRight: 4 }}>🐾</span>
        <span style={{ color: '#E8713A', display: 'inline' }}>Paw</span>Pals
      </Link>
      <div className="navbar-right">
        <ul className="navbar-nav">
          <li>
            <Link to="/utforska">Utforska</Link>
          </li>
          <li>
            <Link to="/organisationer">Organisationer</Link>
          </li>
          {!isAuthLoading && user && user.role === "organization" && (
            <li>
              <Link to="/organisation-dashboard">Dashboard</Link>
            </li>
          )}
          {!isAuthLoading && user && user.role === "admin" && (
            <li>
              <Link to="/admin">Adminpanel</Link>
            </li>
          )}
          {!isAuthLoading && user && (
            <li>
              <Link to="/mina-ansokningar">Mina ansökningar</Link>
            </li>
          )}
          {!isAuthLoading && !user && (
            <li>
              <Link to="/logga-in">Logga in</Link>
            </li>
          )}
        </ul>
        {!isAuthLoading && user && (
          <div className="navbar-profile-menu" ref={menuRef}>
            <button
              type="button"
              className="navbar-avatar-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Öppna profilmeny"
            >
              <span className={`avatar-circle avatar-${avatarStyle}`}>
                {avatarImage ? (
                  <img src={avatarImage} alt="Profilbild" className="avatar-image" />
                ) : (
                  <span className="avatar-initials">{userInitials}</span>
                )}
              </span>
            </button>

            {menuOpen && (
              <div className="navbar-dropdown" role="menu">
                <div className="navbar-dropdown-header">
                  <span className={`avatar-circle avatar-large avatar-${avatarStyle}`}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="Profilbild" className="avatar-image" />
                    ) : (
                      <span className="avatar-initials">{userInitials}</span>
                    )}
                  </span>
                  <div className="navbar-user-info">
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="navbar-dropdown-section">
                  <p className="navbar-section-title">Profilbild</p>
                  <label className="navbar-upload">
                    Ladda upp bild
                    <input type="file" accept="image/*" onChange={handleUpload} />
                  </label>
                  <div className="avatar-style-row">
                    {avatarStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        className={`avatar-style-btn avatar-${style} ${
                          avatarStyle === style && !avatarImage ? "active" : ""
                        }`}
                        onClick={() => handleStylePick(style)}
                        aria-label={`Välj avatar ${style}`}
                      />
                    ))}
                  </div>
                  {avatarError && <p className="avatar-error">{avatarError}</p>}
                </div>

                <button
                  type="button"
                  className="navbar-dropdown-logout"
                  onClick={handleLogout}
                >
                  Logga ut
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
