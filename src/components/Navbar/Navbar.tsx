import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="paw">🐾</span> PawPals
      </Link>
      <ul className="navbar-nav">
        <li><Link to="/utforska">Utforska</Link></li>
        <li><Link to="/organisationer">Organisationer</Link></li>
        <li><Link to="/logga-in">Logga in</Link></li>
      </ul>
    </nav>
  );
}
