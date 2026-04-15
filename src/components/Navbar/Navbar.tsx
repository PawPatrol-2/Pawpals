import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthLoading, logout } = useUser();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="paw">🐾</span> PawPals
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
              <Link to="/organisation-dashboard">Org-dashboard</Link>
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
          <div className="navbar-profile">
            <span>{user.username}</span>
            <button type="button" className="navbar-logout" onClick={logout}>
              Logga ut
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
