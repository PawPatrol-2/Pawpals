import { Link } from "react-router-dom"
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🐾 PawPals
      </Link>
      <ul className="navbar-links">
        <li><Link to="/utforska">Utforska</Link></li>
        <li><Link to="/organisationer">Organisationer</Link></li>
      </ul>
      <Link to="/logga-in" className="navbar-login">Logga in</Link>
    </nav>
  );
}
