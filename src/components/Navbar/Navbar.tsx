import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="paw">🐾</span> PawPals
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          gap: "7.5rem",
        }}
      >
        <ul className="navbar-nav" style={{ margin: 0 }}>
          <li>
            <Link to="/utforska">Utforska</Link>
          </li>
          <li>
            <Link to="/organisationer">Organisationer</Link>
          </li>
          {user?.role === "organization" && (
            <li>
              <Link to="/organisation-dashboard">Org-dashboard</Link>
            </li>
          )}
          <li>
            <Link to="/logga-in">Logga in</Link>
          </li>
        </ul>
        {user && (
          <div className="navbar-profile">
            <img
              src={
                user.avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profilbild"
            />
            <span>{user.username}</span>
            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logga ut
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
