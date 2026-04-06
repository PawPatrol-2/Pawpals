import { useUser } from '../../context/UserContext';
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useUser();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="paw">🐾</span> PawPals
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '7.5rem' }}>
        <ul className="navbar-nav" style={{ margin: 0 }}>
          <li><Link to="/utforska">Utforska</Link></li>
          <li><Link to="/organisationer">Organisationer</Link></li>
          <li><Link to="/logga-in">Logga in</Link></li>
        </ul>
        {user && (
          <div className="navbar-profile">
            <img
              src={user.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="avatar"
            />
            <span>{user.username}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
